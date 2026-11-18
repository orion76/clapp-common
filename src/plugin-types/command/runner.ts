import type { IPluginManager } from '@orion76/plugin';
import { inject, injectable } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import type { IClappLifecycleMap, IEventBus } from '../../types/events';

import { COMMAND_ARGUMENT_MANAGER_TOKEN } from '../command-argument/di-tokens';
import type { IPluginCommandArgument } from '../command-argument/types';
import { applyArgumentChain, resolveArgumentChain } from '../command-argument/utils';

import { reportArgumentFill } from './argument-log';
import { PLUGIN_COMMAND_TYPE } from './constants';
import { COMMAND_MANAGER_TOKEN } from './di-tokens';
import type {
  ICommandResult,
  ICommandRunner,
  IPluginCommand,
  IPluginCommandDefinition,
  UCommandPipelineInput,
} from './types';
import { applyFilledValues, collectCommandValues, toArgumentViews } from './values';
import { validateCommandValues } from './validation';

/**
 * Runner of a command: the single pipeline the CLI and the MCP server execute commands
 * through.
 *
 * The pipeline applies the argument chain to the definition before the host registers the
 * command, then runs `command:start` → plugin instance → `command:arguments` → argument
 * chain → validation → `command:run` → `action` → `command:end`, and reports
 * `command:error` instead of a result when the command fails. The hosts differ in the input
 * they parse and in how they render the result; they do not differ in what runs.
 */
@injectable()
export class CommandRunner implements ICommandRunner {
  @inject(COMMAND_MANAGER_TOKEN) private readonly pluginManager!: IPluginManager<IPluginCommand>;
  @inject(COMMAND_ARGUMENT_MANAGER_TOKEN) private readonly argumentManager!: IPluginManager<IPluginCommandArgument>;
  @inject(EVENT_BUS_TOKEN) private readonly eventBus!: IEventBus<IClappLifecycleMap>;

  /** Chain of the process: its order and its instances never change while the app runs. */
  private _chain?: Promise<IPluginCommandArgument[]>;

  /** Definitions with the chain applied, by definition id: the phase runs once per command. */
  private readonly _prepared = new Map<string, Promise<IPluginCommandDefinition>>();

  /**
   * Applies the argument chain to a copy of a command definition, so the definition a host
   * registers declares the arguments the chain fills as optional.
   *
   * The result is cached by the id of the definition: a host registers the definition it gets
   * here and hands the same one to `run`, and the chain must be applied to it exactly once.
   * @param definition Definition of the command as the manager caches it
   * @returns Definition the host registers and hands to `run`
   */
  async prepareDefinition(definition: IPluginCommandDefinition): Promise<IPluginCommandDefinition> {
    const cached = this._prepared.get(definition.id);

    if (cached !== undefined) {
      return cached;
    }

    const prepared = this.applyChain(definition).catch((error: unknown) => {
      this._prepared.delete(definition.id);

      throw error;
    });

    this._prepared.set(definition.id, prepared);

    return prepared;
  }

  /**
   * Runs a command of the definition the host registered and reports what it produced.
   * @param definition Definition of the command; the chain is applied to it unless it has
   * already been prepared
   * @param input Values as the host parsed them
   * @returns Result of the command action, or a failed result naming why the command did not run
   */
  async run(definition: IPluginCommandDefinition, input: UCommandPipelineInput): Promise<ICommandResult> {
    const prepared = await this.prepareDefinition(definition);
    const { config, id } = prepared;
    const parsed = collectCommandValues(config, input);
    const views = toArgumentViews(config, parsed);

    try {
      await this.hook('command:start', id, views);

      const plugin = await this.pluginManager.getInstance(id);

      if (typeof plugin.action !== 'function') {
        throw new Error(`Command '${id}' has no action to run.`);
      }

      await this.hook('command:arguments', id, views);

      const filled = await this.fillValues(prepared, parsed);

      if (!filled.success) {
        return await this.reject(id, filled.error ?? []);
      }

      const values = filled.data ?? parsed;
      const violations = validateCommandValues(config, id, values);

      if (violations.length > 0) {
        return await this.reject(id, violations);
      }

      await this.hook('command:run', id, { args: values });

      const result = await plugin.action(values);

      if (!result.success) {
        return await this.reject(id, result.error ?? []);
      }

      await this.hook('command:end', id, { result });

      return result;
    } catch (error) {
      await this.reportFailure(id, error);
      throw error;
    }
  }

  /**
   * Runs the argument chain over the values the host parsed: every step receives the values
   * collected so far and contributes the arguments it filled.
   * @param definition Definition prepared by `prepareDefinition`
   * @param values Values the host parsed
   * @returns Values after the chain, or a failed result naming the step that could not fill
   * its arguments
   */
  private async fillValues(
    definition: IPluginCommandDefinition,
    values: Record<string, unknown>,
  ): Promise<ICommandResult<Record<string, unknown>>> {
    const { id } = definition;
    const chain = await this.resolveChain();
    let filled = values;

    for (const step of chain) {
      const stepId = step.definition.id;
      const stepResult = await step.fill({ definition, values: filled });

      if (!stepResult.success) {
        const reasons = stepResult.error ?? [];

        return { success: false, error: reasons.map((reason) => `Argument step '${stepId}': ${reason}`) };
      }

      if (!stepResult.data) {
        continue;
      }

      const applied = applyFilledValues(filled, stepResult.data);
      filled = applied.values;
      reportArgumentFill({ command: id, step: stepId, filled: applied.filled, kept: applied.kept });
    }

    return { success: true, data: filled };
  }

  /**
   * Turns a rejection of the pipeline into a failed result and reports it to the listeners.
   *
   * The reasons travel in `error`, so a host shows them as the failure of the command; the
   * listeners of `command:error` receive the same reasons as one error.
   * @param commandId Identifier of the command that did not run
   * @param reasons Why the command did not run
   * @returns Failed result with the reasons
   */
  private async reject(commandId: string, reasons: string[]): Promise<ICommandResult> {
    const errors = reasons.length > 0 ? reasons : [`Command '${commandId}' failed.`];

    await this.reportFailure(commandId, new Error(errors.join(' ')));

    return { success: false, error: errors };
  }

  /**
   * Reports a failure of the command to the listeners of `command:error`.
   *
   * A listener that fails while a failure is reported does not replace the failure itself:
   * the reason the command did not run is what the host has to show.
   * @param commandId Identifier of the command that failed
   * @param error Failure to report
   */
  private async reportFailure(commandId: string, error: unknown): Promise<void> {
    try {
      await this.hook('command:error', commandId, { error });
    } catch {
      // Intentionally ignored: see the method contract.
    }
  }

  /**
   * Applies the chain to a copy of a definition.
   *
   * The definitions the manager hands out are cached and shared, so a step works on a deep
   * copy: a `required` relaxed by a step must not leak to a host that runs without it.
   * @param definition Definition of the command as the manager caches it
   * @returns Definition with every step of the chain applied
   */
  private async applyChain(definition: IPluginCommandDefinition): Promise<IPluginCommandDefinition> {
    const chain = await this.resolveChain();

    return applyArgumentChain(definition, chain);
  }

  /**
   * Resolves the argument chain once for the process.
   *
   * A failed resolution is not cached: the chain of a run that failed to load its plugins
   * must not be the chain of every later run.
   * @returns Steps of the chain in their order
   */
  private resolveChain(): Promise<IPluginCommandArgument[]> {
    if (this._chain === undefined) {
      this._chain = resolveArgumentChain(this.argumentManager).catch((error: unknown) => {
        this._chain = undefined;
        throw error;
      });
    }

    return this._chain;
  }

  /**
   * Emits a lifecycle event of the command.
   * @param event Event name of the lifecycle map
   * @param pluginId Identifier of the command definition
   * @param data Payload of the event
   */
  private hook<E extends keyof IClappLifecycleMap>(
    event: E,
    pluginId: string,
    data: IClappLifecycleMap[E]['data'],
  ): Promise<IClappLifecycleMap[E]['result']> {
    return this.eventBus.hook(event, { id: pluginId, type: PLUGIN_COMMAND_TYPE, data });
  }
}

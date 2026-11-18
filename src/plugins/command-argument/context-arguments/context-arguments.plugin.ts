import { NodePlugin, PLUGIN_CONTAINER } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';
import type { Container } from 'inversify';

import {
  PLUGIN_COMMAND_ARGUMENT_TYPE,
  PluginCommandArgumentBase,
  isValueMissing,
  type ICommandArgumentState,
  type IPluginCommandArgumentDefinitionData,

} from '../../../plugin-types/command-argument';
import type { ICommandResult, IPluginCommandDefinition } from '../../../plugin-types/command/types';
import { ARGUMENT_CONTEXTS, ARGUMENT_CONTEXT_NAMES } from '../argument-contexts';
import { declaresArgument, relaxFilledArguments, toErrorMessage } from './lib';

/**
 * Standard step of the command argument chain: fills an argument from the application
 * context that already knows its value — the project the launcher runs in, its root.
 *
 * The step declares the arguments it fills optional before the host registers the command,
 * so the CLI parser, the help and the MCP schema stop demanding a value the user does not
 * have to type. The values are resolved only when a command fills its arguments: a context
 * is a lazy singleton, so nothing is computed while the app starts.
 */
@NodePlugin<IPluginCommandArgumentDefinitionData>({
  type: PLUGIN_COMMAND_ARGUMENT_TYPE,
  id: 'context-arguments',
  label: 'Fill arguments from the application context',
  order: 100,
  argumentNames: ARGUMENT_CONTEXT_NAMES,
})
@injectable()
export class ContextArgumentsPlugin extends PluginCommandArgumentBase {
  /**
   * Container of the plugin type: it carries the bindings of the context values, which
   * live in the root container. The property is used only from `fill`, so no context is
   * resolved while the app starts.
   */
  @inject(PLUGIN_CONTAINER) private readonly _container!: Container;

  /**
   * Declares the arguments of the table optional, so the surface does not demand a value
   * the chain provides.
   * @param definition Definition the host is about to register
   * @returns Definition with the filled arguments declared optional
   */
  transformDefinition(definition: IPluginCommandDefinition): IPluginCommandDefinition {
    return { ...definition, config: relaxFilledArguments(definition.config, ARGUMENT_CONTEXT_NAMES) };
  }

  /**
   * Fills the empty arguments of the table with the values of their contexts.
   * @param state Definition of the command plus the values the host has already parsed
   * @returns Values filled by this step, or a failed result naming every argument whose
   * context could not be resolved
   */
  async fill(state: ICommandArgumentState): Promise<ICommandResult<Record<string, unknown>>> {
    const filled: Record<string, unknown> = {};
    const errors: string[] = [];

    for (const binding of ARGUMENT_CONTEXTS) {
      const { argument, context } = binding;

      if (!declaresArgument(state.definition.config, argument) || !isValueMissing(state.values[argument])) {
        continue;
      }

      try {
        const value = await this._container.getAsync(context);

        if (!isValueMissing(value)) {
          filled[argument] = value;
        }
      } catch (error) {
        errors.push(`${argument}: ${toErrorMessage(error)}`);
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: filled };
  }
}

import { IPluginManager } from '@orion76/plugin';
import { Command } from 'commander';
import { inject, injectable } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IAppConfig, IClappLifecycleMap, ICommandExecArguments, ICommandNode, IEventBus } from '../../types';

import { COMMAND_ARGUMENT_MANAGER_TOKEN } from '../command-argument/di-tokens';
import type { IPluginCommandArgument } from '../command-argument/types';
import { applyArgumentChain, resolveArgumentChain } from '../command-argument/utils';

import { PLUGIN_COMMAND_TYPE } from './constants';
import { COMMAND_MANAGER_TOKEN } from './di-tokens';
import { ICommandResult, ICommandService, IPluginCommand, IPluginCommandDefinition, TCommandResultRenderer, TEventArgs, TEventName } from './types';
import { buildHierarchy, createProgram, initializeCommand } from './utils';


@injectable()
export class CommandService implements ICommandService {
  @inject(COMMAND_MANAGER_TOKEN) private readonly pluginManager!: IPluginManager<IPluginCommand>;
  @inject(COMMAND_ARGUMENT_MANAGER_TOKEN) private readonly argumentManager!: IPluginManager<IPluginCommandArgument>;
  @inject(EVENT_BUS_TOKEN) private readonly eventBus!: IEventBus<IClappLifecycleMap>;
  createProgram(config: IAppConfig): Command {
    return createProgram(config);
  }


  /**
   * Registers the commands of the discovered command plugins in the program.
   *
   * The argument chain is resolved once, before any command is registered: a step of it
   * rewrites the definition of a command, and commander must build the `Argument`/`Option`
   * objects of the command with the rewritten `config` — that is what makes a filled
   * argument optional in `--help` and in the parsing of argv.
   * @param program Commander program the commands are registered in
   * @param renderResult Writes the result of a command that declares a formatter
   */
  async createAppCommands(program: Command, renderResult: TCommandResultRenderer): Promise<void> {
    const definitions = await this.pluginManager.getDefinitions();
    const nodes = buildHierarchy(definitions);
    const chain = await resolveArgumentChain(this.argumentManager);

    for (const node of nodes) {
      await this.createNodeCommands(program, node, chain, renderResult);
    }
  }

  async createCommands(
    parent: Command,
    nodes: ICommandNode[],
    chain: readonly IPluginCommandArgument[],
    renderResult: TCommandResultRenderer,
  ): Promise<void> {
    for (const node of nodes) {
      await this.createNodeCommands(parent, node, chain, renderResult);
    }
  }

  async createNodeCommands(
    parent: Command,
    node: ICommandNode,
    chain: readonly IPluginCommandArgument[],
    renderResult: TCommandResultRenderer,
  ): Promise<void> {
    // const nodes = buildHierarchy(definitions)
    let command: Command;
    if (node.children.length > 0) {
      command = await this._createGroup(node, chain, renderResult)

    } else {
      command = this._createCommand(node.definition, chain, renderResult);
    }
    parent.addCommand(command);
  }

  private async _createGroup(
    { definition, children }: ICommandNode,
    chain: readonly IPluginCommandArgument[],
    renderResult: TCommandResultRenderer,
  ): Promise<Command> {
    const group = new Command(definition.command);
    group.description(definition.label);
    await this.createCommands(group, children, chain, renderResult);
    return group;
  }

  createEventArguments<E extends keyof IClappLifecycleMap>(event: E, pluginId: string, data: IClappLifecycleMap[E]['data']) {
    return { id: pluginId, type: PLUGIN_COMMAND_TYPE, data }
  }

  /**
   * Registers a leaf command in commander.
   *
   * The name on the surface comes from `definition.command` — the segment a user types,
   * such as `list` nested under `board`. The action keeps receiving `definition.id`: that
   * is the identifier of the plugin definition the manager resolves the plugin by, and for
   * a command of a set it is the full path (`board_list`) rather than the segment.
   * @param definition Definition of the leaf command as the manager caches it
   * @param chain Steps of the argument chain applied to a copy of the definition
   * @param renderResult Writes the result of the command that declares a formatter
   * @returns Registered commander command
   */
  private _createCommand(
    definition: IPluginCommandDefinition,
    chain: readonly IPluginCommandArgument[],
    renderResult: TCommandResultRenderer,
  ): Command {
    const overridden = applyArgumentChain(definition, chain);
    const { id, command } = overridden;
    const leafCommand = new Command(command);
    initializeCommand(leafCommand, overridden);
    let promise: Promise<ICommandResult>;
    const action = async (...allArgs: any[]) => {
      const commandArgs = this.parseCommandArgs(allArgs);

      await this.hook('command:start', id, commandArgs);
      const { args, opts } = commandArgs
      const plugin = await this.pluginManager.getInstance(id);
      await this.hook('command:arguments', id, commandArgs);
      const pluginArgs = await plugin.getArguments(args, opts);
      await this.hook('command:run', id, commandArgs);
      promise = new Promise<ICommandResult>((resolve, reject) => {
        try {
          const result = plugin.action(pluginArgs);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      await promise.then((result) => renderResult(overridden, result));

    }
    leafCommand.action(action);


    return leafCommand;
  }

  parseCommandArgs(allArgs: any[]): ICommandExecArguments {
    const command = allArgs[allArgs.length - 1]; // Command object is always last
    const opts = command.opts(); // Get options from Command object
    const args = allArgs.slice(0, -2); // All except last are arguments
    return { name: command.name(), args, opts };
  }
  private async hook<E extends TEventName>(event: E, pluginId: string, data: TEventArgs<E>) {
    await this.eventBus.hook(event, { ...data, id: pluginId, type: PLUGIN_COMMAND_TYPE, data });
  }
}

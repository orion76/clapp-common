import { IPluginManager } from '@orion76/plugin';
import { Command } from 'commander';
import { inject, injectable } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IAppConfig, IClappLifecycleMap, ICommandExecArguments, ICommandNode, IEventBus } from '../../types';


import { IContextService } from '../context';
import { PLUGIN_COMMAND_TYPE } from './constants';
import { COMMAND_MANAGER_TOKEN } from './di-tokens';
import { ICommandResult, ICommandService, IPluginCommand, IPluginCommandDefinition, TCommandResultRenderer, TEventArgs, TEventName } from './types';
import { buildHierarchy, createProgram, initializeCommand } from './utils';


@injectable()
export class CommandService implements ICommandService {
  @inject(COMMAND_MANAGER_TOKEN) private readonly pluginManager!: IPluginManager<IPluginCommand>;
  @inject(EVENT_BUS_TOKEN) private readonly eventBus!: IEventBus<IClappLifecycleMap>;
  createProgram(config: IAppConfig): Command {
    return createProgram(config);
  }


  /**
   * Registers the commands of the discovered command plugins in the program.
   *
   * `context` is accepted to satisfy `ICommandService`; it is not passed to the
   * commands yet, so threading the contexts into a command action stays separate work.
   * @param program Commander program the commands are registered in
   * @param context Application contexts of the program
   * @param renderResult Writes the result of a command that declares a formatter
   */
  async createAppCommands(program: Command, context: IContextService, renderResult: TCommandResultRenderer): Promise<void> {
    const definitions = await this.pluginManager.getDefinitions();
    const nodes = buildHierarchy(definitions);

    for (const node of nodes) {
      await this.createNodeCommands(program, node, renderResult);
    }
  }

  async createCommands(parent: Command, nodes: ICommandNode[], renderResult: TCommandResultRenderer): Promise<void> {
    for (const node of nodes) {
      await this.createNodeCommands(parent, node, renderResult);
    }
  }

  async createNodeCommands(parent: Command, node: ICommandNode, renderResult: TCommandResultRenderer): Promise<void> {
    // const nodes = buildHierarchy(definitions)
    let command: Command;
    if (node.children.length > 0) {
      command = await this._createGroup(node, renderResult)

    } else {
      command = this._createCommand(node.definition, renderResult);
    }
    parent.addCommand(command);
  }

  private async _createGroup({ definition, children }: ICommandNode, renderResult: TCommandResultRenderer): Promise<Command> {
    const group = new Command(definition.command);
    group.description(definition.label);
    await this.createCommands(group, children, renderResult);
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
   * @param definition Definition of the leaf command
   * @param renderResult Writes the result of the command that declares a formatter
   * @returns Registered commander command
   */
  private _createCommand(definition: IPluginCommandDefinition, renderResult: TCommandResultRenderer): Command {
    const { id, command } = definition;
    const leafCommand = new Command(command);
    initializeCommand(leafCommand, definition);
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
      await promise.then((result) => renderResult(definition, result));

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

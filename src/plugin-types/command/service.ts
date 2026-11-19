import { IPluginManager } from '@orion76/plugin';
import { Command } from 'commander';
import { inject, injectable } from 'inversify';

import { IAppConfig, ICommandNode } from '../../types';

import { COMMAND_MANAGER_TOKEN, COMMAND_RUNNER_TOKEN } from './di-tokens';
import type {
  ICommandRunner,
  ICommandService,
  IPluginCommand,
  IPluginCommandDefinition,
  TCommandResultRenderer,
} from './types';
import { buildHierarchy, createProgram, initializeCommand, parseCommandArguments } from './utils';

/**
 * Registers the commands of the discovered command plugins in a commander program.
 *
 * The service owns the shape of the surface — the hierarchy of groups and commands, the
 * arguments and options of every command — and hands the execution of a command to
 * `ICommandRunner`, so the CLI and the MCP server run a command through one pipeline and a
 * result is rendered by the host that owns the output stream.
 */
@injectable()
export class CommandService implements ICommandService {
  @inject(COMMAND_MANAGER_TOKEN) private readonly pluginManager!: IPluginManager<IPluginCommand>;
  @inject(COMMAND_RUNNER_TOKEN) private readonly runner!: ICommandRunner;

  createProgram(config: IAppConfig): Command {
    return createProgram(config);
  }

  /**
   * Registers the commands of the discovered command plugins in the program.
   * @param program Commander program the commands are registered in
   * @param renderResult Writes the result of a command that declares a data schema
   */
  async createAppCommands(program: Command, renderResult: TCommandResultRenderer): Promise<void> {
    const definitions = await this.pluginManager.getDefinitions();
    const nodes = buildHierarchy(definitions);

    await this.createCommands(program, nodes, renderResult);
  }

  /**
   * Registers the commands of the nodes in the parent command.
   * @param parent Command the nodes are registered in
   * @param nodes Nodes of the hierarchy to register
   * @param renderResult Writes the result of a command that declares a data schema
   */
  private async createCommands(
    parent: Command,
    nodes: ICommandNode[],
    renderResult: TCommandResultRenderer,
  ): Promise<void> {
    for (const node of nodes) {
      await this.createNodeCommands(parent, node, renderResult);
    }
  }

  /**
   * Registers one node: a group becomes a command with its own children, a leaf becomes an
   * executable command.
   * @param parent Command the node is registered in
   * @param node Node of the hierarchy to register
   * @param renderResult Writes the result of a command that declares a data schema
   */
  private async createNodeCommands(
    parent: Command,
    node: ICommandNode,
    renderResult: TCommandResultRenderer,
  ): Promise<void> {
    const command =
      node.children.length > 0
        ? await this.createGroup(node, renderResult)
        : await this.createCommand(node.definition, renderResult);

    parent.addCommand(command);
  }

  /**
   * Registers a group: a command that only carries the description and the subcommands of
   * the node.
   * @param node Node with children
   * @param renderResult Writes the result of a command that declares a data schema
   * @returns Registered commander command
   */
  private async createGroup(
    { definition, children }: ICommandNode,
    renderResult: TCommandResultRenderer,
  ): Promise<Command> {
    const group = new Command(definition.command);
    group.description(definition.label);

    await this.createCommands(group, children, renderResult);

    return group;
  }

  /**
   * Registers a leaf command in commander.
   *
   * The name on the surface comes from `definition.command` — the segment a user types,
   * such as `list` nested under `board`. The definition is prepared by the runner first: the
   * argument chain rewrites it, and commander has to build the `Argument`/`Option` objects of
   * the command with the rewritten `config`, which is what makes a filled argument optional
   * in `--help` and in the parsing of argv.
   * @param definition Definition of the leaf command as the manager caches it
   * @param renderResult Writes the result of the command that declares a data schema
   * @returns Registered commander command
   */
  private async createCommand(
    definition: IPluginCommandDefinition,
    renderResult: TCommandResultRenderer,
  ): Promise<Command> {
    const overridden = await this.runner.prepareDefinition(definition);
    const leafCommand = new Command(overridden.command);
    initializeCommand(leafCommand, overridden);

    leafCommand.action(async (...allArgs: unknown[]) => {
      const result = await this.runner.run(overridden, parseCommandArguments(allArgs));

      await renderResult(overridden, result);
    });

    return leafCommand;
  }
}

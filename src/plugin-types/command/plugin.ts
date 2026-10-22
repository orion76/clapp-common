import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from '../../types/commander';
import { PLUGIN_COMMAND_TYPE, PLUGIN_CONTEXT_TYPE, PLUGIN_FORMATTER_TYPE, type UCommandDefinitionKind } from '../constants';
export type UPluginTypes = typeof PLUGIN_COMMAND_TYPE | typeof PLUGIN_CONTEXT_TYPE | typeof PLUGIN_FORMATTER_TYPE;

export interface ICommandConfig {
  arguments?: ICommandArgument[];
  options?: ICommandOption[];
  aliases?: string[];
  description?: string;
}

/**
 * Flat command definition. Hierarchy is expressed with the optional `parent`
 * field — the id of the definition this command belongs to.
 *
 * `id` and `command` name different things. `id` is the identifier of the plugin
 * definition and is the key the engine addresses the plugin by; `command` is the name
 * the command has on the surface whose engine registers it. The definition loader keys
 * definitions by `id` alone — ignoring `parent` — and rejects a duplicate with
 * `Plugin definition already exists`, so a command set keeps its `id`s flat and unique:
 * for a command of a set the id is the full path from the root to the subcommand joined
 * with `_` (`board`, `board_list`, `board_next`, `skill`, `skill_add`, `skill_list`).
 */
export interface IPluginCommandDefinition<A = {}, C = {}> extends IPluginDefinition {
  /**
   * Name of the command on the surface that registers it: the segment a user types in
   * commander, that is the last segment of the path of the command (`list`, `next`,
   * `add`). A group node names the segment its subcommands are nested under (`board`,
   * `skill`). An id of a set command is the full path (`board_list`), so the surface
   * name is always the `command` and never the `id`.
   */
  command: string;
  /**
   * Kind of the command. A project command has exactly one of three kinds, and
   * each kind maps to a surface of the MCP server a host may expose:
   * - `resource` (`COMMAND_KIND_RESOURCE`) — a query for information about the
   *   project or its state, without side effects (MCP Resources:
   *   `resources/list`, `resources/read`);
   * - `tool` (`COMMAND_KIND_TOOL`) — an action in the project within a
   *   workflow, with side effects (MCP Tools: `tools/list`, `tools/call`);
   * - `prompt` (`COMMAND_KIND_PROMPT`) — an instruction sent to the model
   *   together with its arguments (MCP Prompts: `prompts/list`, `prompts/get`).
   *
   * The group marker (`COMMAND_KIND_GROUP`) is reserved for a group node — a
   * node that only carries subcommands and has no surface of its own, so it is
   * never mapped to MCP.
   */
  kind: UCommandDefinitionKind;
  /**
   * Id of the parent definition this command is nested under, or omitted for a root
   * command. The reference is by `id`, not by `command`: `board_list` declares
   * `parent: 'board'`, while its `command` is `list`.
   */
  parent?: string;
  /**
   * Identifier of the formatter the core prints the command result with. When
   * it is set, the command is expected to return its data in `ICommandResult.data`
   * instead of printing it; the core resolves the formatter plugin with this id
   * and writes its output to stdout. The type is a plain string here, because
   * this package must not depend on the list of formatters — command authors get
   * the strict union `UFormatterKind` from `plugin-types/command/formatter`.
   */
  formatter?: string;
  /**
   * Array of context identifiers that this command requires to execute.
   * Each string is the id of a context plugin (e.g. "project", "cwd").
   * The values of these contexts will be passed to the command's `action` method
   * as the second argument.
   */
  contexts?: (keyof C)[];
  config: ICommandConfig;
  pluginClass: IType<IPluginCommand<A>>;
}
/**
 * Authoring-time command definition. `pluginClass` is attached by the
 * `@NodePlugin` decorator, so it is omitted from the object the author writes.
 */
export type IPluginCommandDefinitionData<A = {}, C = {}> = Omit<IPluginCommandDefinition<A, C>, 'pluginClass'>;

export interface IPluginCommand<A = {}, C = {}> extends IPlugin {
  definition: IPluginCommandDefinition<A, C>;
  getArguments: (args: string[], opts: Record<string, unknown>) => Promise<A>;
  /**
   * Action handler invoked with the parsed operands and options, plus an array
   * of context values required by the command.
   * @param args Positional and named operands declared by the command definition
   * @param contexts Array of context values corresponding to the command's `contexts` declaration
   */
  action: (args: A, contexts: C) => Promise<ICommandResult>;
}
/**
 * Single command definition type. Kept as an alias for backward compatibility;
 * `IPluginCommandDefinition` is the only command definition shape now.
 */
export type UPluginCommandDefinition = IPluginCommandDefinition;

/**
 * Result of a command action.
 *
 * A command that declares a `formatter` returns the data to render in `data`;
 * the core passes it to the formatter plugin and prints the returned string.
 * Commands without a formatter keep printing their own output and leave `data`
 * unset.
 * @template D Type of the data handed to the formatter; `unknown` by default
 */
export interface ICommandResult<D = unknown> {
  success: boolean;
  error?: string[];
  /** Data for the formatter declared by the command definition. */
  data?: D;
}

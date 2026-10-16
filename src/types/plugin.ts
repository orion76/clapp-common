import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from './commander';
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
 * field — the id of the top-level command (group) this command belongs to.
 */
export interface IPluginCommandDefinition<A = {}> extends IPluginDefinition {
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
  parent?: string;
  /**
   * Identifier of the formatter the core prints the command result with. When
   * it is set, the command is expected to return its data in `ICommandResult.data`
   * instead of printing it; the core resolves the formatter plugin with this id
   * and writes its output to stdout. The type is a plain string here, because
   * this package must not depend on the list of formatters — command authors get
   * the strict union `UFormatterKind` from `@clapp/command`.
   */
  formatter?: string;
  config: ICommandConfig;
  pluginClass: IType<IPluginCommand<A>>;
}
/**
 * Authoring-time command definition. `pluginClass` is attached by the
 * `@NodePlugin` decorator, so it is omitted from the object the author writes.
 */
export type IPluginCommandDefinitionData<A = {}> = Omit<IPluginCommandDefinition<A>, 'pluginClass'>;

export interface IPluginCommand<A = {}> extends IPlugin {
  definition: IPluginCommandDefinition<A>;
  getArguments: (args: string[], opts: Record<string, unknown>) => Promise<A>;
  action: (args: A) => Promise<ICommandResult>;
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

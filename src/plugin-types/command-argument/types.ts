import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';

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
export interface IPluginCommandArgumentDefinition<A = {}, C = {}> extends IPluginDefinition {
  pluginClass: IType<IPluginCommandArgument<A>>;
}
/**
 * Authoring-time command definition. `pluginClass` is attached by the
 * `@NodePlugin` decorator, so it is omitted from the object the author writes.
 */
export type IPluginCommandArgumentDefinitionData<A = {}, C = {}> = Omit<IPluginCommandArgumentDefinition<A, C>, 'pluginClass'>;

export interface IPluginCommandArgument<A = {}, C = {}> extends IPlugin {
  definition: IPluginCommandArgumentDefinition<A, C>;
  /**
   * Action handler invoked with the parsed operands and options, plus an array
   * of context values required by the command.
   * @param args Positional and named operands declared by the command definition
   * @param contexts Array of context values corresponding to the command's `contexts` declaration
   */
  action: (args: A, contexts: C) => Promise<ICommandArgumentResult>;
}

/**
 * Result of a command action.
 *
 * A command that declares a `formatter` returns the data to render in `data`;
 * the core passes it to the formatter plugin and prints the returned string.
 * Commands without a formatter keep printing their own output and leave `data`
 * unset.
 * @template D Type of the data handed to the formatter; `unknown` by default
 */
export interface ICommandArgumentResult<D = unknown> {
  success: boolean;
  error?: string[];
  /** Data for the formatter declared by the command definition. */
  data?: D;
}

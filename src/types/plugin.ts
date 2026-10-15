import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from './commander';
import { PLUGIN_COMMAND_TYPE, PLUGIN_CONTEXT_TYPE } from '../constants';
export type UPluginTypes = typeof PLUGIN_COMMAND_TYPE | typeof PLUGIN_CONTEXT_TYPE;

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
  parent?: string;
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

export interface ICommandResult {
  success: boolean;
  error?: string[];
}

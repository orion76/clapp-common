import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from './commander';

export interface ICommandDefintion {
  arguments?: ICommandArgument[];
  options?: ICommandOption[];
  aliases?: string[];
  description?: string;
}

export type UCommandDefinitionType = 'command' | 'main';

export interface IPluginCommandDefinitionBase extends IPluginDefinition {
  commandType: UCommandDefinitionType;
}

export interface IPluginCommandDefinition<A = {}> extends IPluginCommandDefinitionBase {
  commandType: 'command';
  command: ICommandDefintion;
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
  action: (args: A) => ICommandResult | Promise<ICommandResult>;
}
export interface IPluginCommandWithSubcommandsDefinition extends IPluginCommandDefinitionBase {
  commandType: 'main';
  commands: UPluginCommandDefinition[];
}

export type UPluginCommandDefinition = IPluginCommandDefinition | IPluginCommandWithSubcommandsDefinition;

export interface IPluginCommandWithSubcommands extends IPlugin {
  definition: IPluginCommandWithSubcommandsDefinition;
}

export interface ICommandResult {
  success: boolean;
  error?: string[];
}

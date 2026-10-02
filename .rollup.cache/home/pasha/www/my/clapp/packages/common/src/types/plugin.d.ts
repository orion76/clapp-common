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
export interface IPluginCommand<A = {}> extends IPlugin {
    definition: IPluginCommandDefinition;
    getArguments: (args: string[], opts: Record<string, unknown>) => A;
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

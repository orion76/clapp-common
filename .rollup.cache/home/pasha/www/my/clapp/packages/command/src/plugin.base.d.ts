import { PluginBase } from '@orion76/plugin';
import { IPluginCommand, IPluginCommandDefinition, ICommandResult } from '@clapp/common';
/**
 * Command plugin instance
 * Handles command registration and execution using the plugin system
 */
export declare abstract class PluginCommandBase<A = {}> extends PluginBase implements IPluginCommand<A> {
    definition: IPluginCommandDefinition;
    constructor(definition: IPluginCommandDefinition);
    abstract action(args: A): ICommandResult | Promise<ICommandResult>;
    getArguments<O extends object = object>(args: string[], opts: O): A;
}

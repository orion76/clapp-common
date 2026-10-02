import { IPluginCommand, IPluginCommandDefinition } from '@clapp/command';
import { PluginBuilderBase } from '@orion76/plugin';
export declare class CommandPluginBuilder extends PluginBuilderBase<IPluginCommand> {
    build(definition: IPluginCommandDefinition): IPluginCommand;
}

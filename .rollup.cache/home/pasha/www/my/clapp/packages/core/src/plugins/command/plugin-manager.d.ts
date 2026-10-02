import { IPluginBuilder, IPluginDiscovery, PluginManagerBase } from '@orion76/plugin';
import { IPluginCommand, IPluginCommandDefinition } from '@clapp/common';
/**
 * Plugin manager for commands
 * Manages command plugins registration and lifecycle
 */
export declare class CommandPluginManager extends PluginManagerBase<IPluginCommand> {
    protected pluginDiscovery: IPluginDiscovery<IPluginCommandDefinition>;
    protected pluginBuilder: IPluginBuilder<IPluginCommand>;
    type: string;
    constructor(pluginDiscovery: IPluginDiscovery<IPluginCommandDefinition>, pluginBuilder: IPluginBuilder<IPluginCommand>);
}

import { PluginManagerBase } from '@orion76/plugin';
import { PLUGIN_COMMAND_TYPE } from '@clapp/common';
/**
 * Plugin manager for commands
 * Manages command plugins registration and lifecycle
 */
export class CommandPluginManager extends PluginManagerBase {
    pluginDiscovery;
    pluginBuilder;
    type = PLUGIN_COMMAND_TYPE;
    constructor(pluginDiscovery, pluginBuilder) {
        super();
        this.pluginDiscovery = pluginDiscovery;
        this.pluginBuilder = pluginBuilder;
    }
}
//# sourceMappingURL=plugin-manager.js.map
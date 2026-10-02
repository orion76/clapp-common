import { CommandPluginBuilder } from './plugin-builder';
import { CommandPluginDiscovery } from './plugin-discovery/plugin-discovery';
import { CommandPluginManager } from './plugin-manager';
export async function createPluginManager(projects, config) {
    const pluginDiscovery = new CommandPluginDiscovery(projects, config);
    await pluginDiscovery.initialize();
    const pluginBuilder = new CommandPluginBuilder();
    return new CommandPluginManager(pluginDiscovery, pluginBuilder);
}
//# sourceMappingURL=plugin-manager.factory.js.map
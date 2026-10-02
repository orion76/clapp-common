import { PluginBuilderBase } from '@orion76/plugin';
export class CommandPluginBuilder extends PluginBuilderBase {
    build(definition) {
        const { pluginClass, id } = definition;
        if (!pluginClass) {
            throw new Error(`[Command plugin] "pluginClass" for plugin: ${id} is missing.`);
        }
        return new pluginClass(definition);
    }
}
//# sourceMappingURL=plugin-builder.js.map
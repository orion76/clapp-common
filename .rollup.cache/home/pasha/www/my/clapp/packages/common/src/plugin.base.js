import { PluginBase } from '@orion76/plugin';
/**
 * Command plugin instance
 * Handles command registration and execution using the plugin system
 */
export class PluginCommandBase extends PluginBase {
    definition;
    constructor(definition) {
        super();
        this.definition = definition;
    }
    getArguments(args, opts) {
        const _args = { ...opts };
        if (this.definition.command.arguments) {
            this.definition.command.arguments.forEach((arg, index) => {
                const { name } = arg;
                _args[name] = args[index];
            });
        }
        return _args;
    }
}
//# sourceMappingURL=plugin.base.js.map
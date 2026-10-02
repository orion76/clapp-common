import { IPluginDefinition, PluginDiscoveryAsyncBase } from '@orion76/plugin';
import { IPluginDiscoveryConfig } from '@clapp/common';
/**
 * Plugin discovery for commands
 * Loads command configurations from files and converts them to plugin definitions
 */
export declare abstract class CommandPluginDiscoveryBase<D extends IPluginDefinition> extends PluginDiscoveryAsyncBase<D> {
    abstract type: string;
    protected abstract projects: string[];
    protected abstract config: IPluginDiscoveryConfig;
    protected definitions: D[];
    getDefinitions(): Promise<D[]>;
    findDefinitions(): Promise<D[]>;
    /**
     * Load command configuration from specific file using dynamic import
     * @param filePath Path to command file
     * @returns Command configuration or null
     */
    private loadCommandFromFile;
    getCommandPaths(commandsDirectory: string): string[];
    findDefinitionFileNames(): string[];
}

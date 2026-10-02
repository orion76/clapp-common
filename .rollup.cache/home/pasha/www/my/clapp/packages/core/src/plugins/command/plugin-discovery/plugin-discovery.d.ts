import { IPluginCommandDefinition, IPluginDiscoveryConfig } from '@clapp/common';
import { CommandPluginDiscoveryBase } from '../../common/plugin-discovery/plugin-discovery.base';
/**
 * Plugin discovery for commands
 * Loads command configurations from files and converts them to plugin definitions
 */
export declare class CommandPluginDiscovery extends CommandPluginDiscoveryBase<IPluginCommandDefinition> {
    protected projects: string[];
    protected config: IPluginDiscoveryConfig;
    type: string;
    constructor(projects: string[], config: IPluginDiscoveryConfig);
    initialize(): Promise<void>;
}

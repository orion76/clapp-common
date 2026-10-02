import { IPluginDiscoveryConfig } from '@clapp/common';
import { CommandPluginManager } from './plugin-manager';
export declare function createPluginManager(projects: string[], config: IPluginDiscoveryConfig): Promise<CommandPluginManager>;

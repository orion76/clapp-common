import { IPlugin, IPluginDefinition } from '@orion76/plugin';

export interface IPluginContextDefinition<C = unknown> extends IPluginDefinition {
  dependencies?: string[];
}

export interface IPluginContext<C = unknown, A extends unknown[] = unknown[]> extends IPlugin {
  definition: IPluginContextDefinition<C>;
  getContext: (...args: A) => Promise<C>;
}

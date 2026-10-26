import { IPlugin, IPluginDefinition } from '@orion76/plugin';

export interface IPluginContextDefinition extends IPluginDefinition {
  dependencies?: string[];
}

export interface IPluginContext<C extends unknown = unknown> extends IPlugin {
  definition: IPluginContextDefinition;
  getContext(...args: unknown[]): Promise<C>;
}

export interface IContextService<M extends Record<string, unknown> = {}> {
  get(token: keyof M): Promise<M[keyof M]>
}
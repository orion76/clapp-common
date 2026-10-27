import { IPlugin, IPluginDefinition } from '@orion76/plugin';

export interface IPluginContextDefinition extends IPluginDefinition {
  dependencies?: string[];
}

export interface IPluginContext<C extends unknown = unknown, D extends unknown[] = unknown[]> extends IPlugin {
  definition: IPluginContextDefinition;
  getContext(...args: D): Promise<C>;
}

export interface IContextService {
  get<T>(token: InjectableIdentifier<T>): Promise<T>
}

export type InjectableIdentifier<TInstance = unknown> = string;


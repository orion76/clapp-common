import type { IPlugin, IPluginDefinition } from '@orion76/plugin';

/**
 * Branded string token of a context value. The runtime value is the `id` of the
 * context plugin, so discovery and `IPluginDefinition.id` stay string-based, while
 * the brand makes the token carry the type of the value injected by it.
 * @template TInstance Value type associated with the token
 */
export type TContextIdentifier<TInstance = unknown> = string & { readonly __instance: TInstance };

/**
 * Creates a context token for the context plugin `id`: the id itself, branded
 * with the type of the value that plugin provides.
 * @template T Value type associated with the token
 * @param id Id of the context plugin providing the value
 */
export function contextToken<T>(id: string): TContextIdentifier<T> {
  return id as TContextIdentifier<T>;
}

/**
 * Definition of a context plugin. Its `id` is both the name of the context for
 * discovery and the token its value is injected by.
 * @template C Context value
 */
export interface IPluginContextDefinition<C = unknown> extends IPluginDefinition {
  id: TContextIdentifier<C>;
}

/**
 * Context plugin: provides a value to the DI container under its own token.
 * Dependencies are injected into the plugin fields (`@inject(TOKEN)`); the value
 * is built on the first request of the token and cached for the process lifetime.
 * @template C Context value
 */
export interface IPluginContext<C = unknown> extends IPlugin {
  definition: IPluginContextDefinition<C>;
  getContext(): Promise<C>;
}

import { IPlugin, IPluginDefinition } from '@orion76/plugin';

/**
 * Branded string token used as a context dependency id and as a DI identifier.
 *
 * The brand `readonly __instance: TInstance` is REQUIRED (no `?`), so a plain
 * string never satisfies the type: only tokens produced by `contextToken()` (or
 * explicitly branded ones) are valid. This forces `getContext` argument types
 * and their order to be derived from the plugin `dependencies` instead of being
 * written by hand.
 * @template TInstance Value type associated with the token
 */
export type InjectableIdentifier<TInstance = unknown> = string & { readonly __instance: TInstance };

/**
 * Creates a branded token with the given runtime id string.
 * @template T Value type associated with the token
 * @param id Runtime id (a plain string at runtime — the brand is a phantom type)
 */
export function contextToken<T>(id: string): InjectableIdentifier<T> {
  return id as InjectableIdentifier<T>;
}

/**
 * Maps a tuple of tokens to a tuple of their value types.
 * @template D Token tuple
 */
export type TTokenValues<D extends readonly InjectableIdentifier<any>[]> = {
  [K in keyof D]: D[K] extends InjectableIdentifier<infer V> ? V : never;
};

/**
 * Context plugin definition. The `dependencies` field lists the context tokens
 * whose values are passed to `getContext(...)` in order.
 * @template D Token tuple of the context dependencies
 */
export interface IPluginContextDefinition<D extends readonly InjectableIdentifier<any>[] = readonly InjectableIdentifier<any>[]>
  extends IPluginDefinition {
  dependencies?: D;
}

export interface IPluginContext<
  C extends unknown = unknown,
  D extends readonly InjectableIdentifier<any>[] = readonly InjectableIdentifier<any>[],
> extends IPlugin {
  definition: IPluginContextDefinition<D>;
  getContext(...args: TTokenValues<D>): Promise<C>;
}

export interface IContextService {
  get<T>(token: InjectableIdentifier<T>): Promise<T>;
}

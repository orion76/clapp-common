import { IPlugin, IPluginDefinition } from '@orion76/plugin';

/**
 * Branded symbol token of a context value.
 *
 * The brand `readonly __instance: TInstance` is REQUIRED (no `?`), so a plain
 * symbol never satisfies the type: only tokens produced by `contextToken()` are
 * valid, and the value type travels with the token. Symbols are unique by
 * construction, so tokens declared by different libraries never collide, even
 * when the contexts behind them share a string id.
 * @template TInstance Value type associated with the token
 */
export type TContextIdentifier<TInstance = unknown> = symbol & { readonly __instance: TInstance };

/**
 * Creates a context token: a unique symbol whose description is the id of the
 * context plugin providing the value.
 * @template T Value type associated with the token
 * @param id Id of the context plugin providing the value
 */
export function contextToken<T>(id: string): TContextIdentifier<T> {
  return Symbol(id) as TContextIdentifier<T>;
}

/**
 * Returns the id of the context plugin behind the token. The plugin manager
 * addresses plugins by the string id of their definition, while the token itself
 * is the DI identifier of the value.
 * @param token Context token created by {@link contextToken}
 */
export function getContextTokenId(token: TContextIdentifier<unknown>): string {
  const id = token.description;

  if (!id) {
    throw new Error('Context token has no plugin id: declare tokens with contextToken(id).');
  }

  return id;
}

/**
 * Lazy accessor of a context value: what a plugin receives through
 * `@inject(TOKEN)`. The value is resolved on call, so a context unavailable in
 * the current environment fails only where it is actually requested.
 * @template T Context value type
 */
export type TContextAccessor<T> = () => Promise<T>;

/**
 * Context plugin definition. The `id` is the only string name of a context: it
 * names the plugin for discovery and becomes the description of its token.
 */
export interface IPluginContextDefinition extends IPluginDefinition {}

/**
 * Context plugin. A context pulls the values it depends on from the injected
 * {@link IContextService} — `this._context.get(TOKEN)` inside `getContext` — so
 * `getContext` takes no arguments.
 * @template C Context value
 */
export interface IPluginContext<C extends unknown = unknown> extends IPlugin {
  definition: IPluginContextDefinition;
  getContext(): Promise<C>;
}

export interface IContextService {
  get<T>(token: TContextIdentifier<T>): Promise<T>;
}

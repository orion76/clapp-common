import type { IPluginManager } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';
import { CONTEXT_MANAGER_TOKEN } from './di-tokens';
import { IContextService, InjectableIdentifier, IPluginContext, IPluginContextDefinition } from './types';

/**
 * Specialized DI container for application contexts: a core service (a facade
 * over the context plugin manager), not a plugin. The plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), not in `plugins/`.
 *
 * The contexts it resolves are plugins of type `PLUGIN_CONTEXT_TYPE` living in
 * `packages/common/src/plugins/context/**`.
 *
 * `get(token)` resolves the context plugin, satisfies its `dependencies` (other
 * context tokens) and passes the dependency **values** to `getContext(...)` in
 * `dependencies` order. Non-context dependencies are injected through DI.
 *
 * Resolved context values are cached in `_resolved` (a Map of values, not
 * plugin instances): a repeated `get(token)` returns the cached value without
 * recreating the context. Cache refresh is out of scope.
 */
@injectable()
export class AppContext implements IContextService {
  private readonly _resolved = new Map<any, any>();

  @inject(CONTEXT_MANAGER_TOKEN) private readonly _pluginManager!: IPluginManager<IPluginContext>;

  /**
   * Resolves the context plugin with the given token, satisfying its context
   * dependencies first, and returns its cached value.
   * @template T Resolved context value type
   * @param token Branded context token
   */
  async get<T>(token: InjectableIdentifier<T>): Promise<T> {
    if (this._resolved.has(token)) {
      return this._resolved.get(token) as T;
    }
    const value = await this._getContext(token);
    this._resolved.set(token, value);
    return value;
  }

  /**
   * Builds the context value by instantiating the context plugin and calling
   * `getContext(...)` with the values of its context dependencies in order.
   * @template T Resolved context value type
   * @param token Branded context token
   */
  private async _getContext<T>(token: InjectableIdentifier<T>): Promise<T> {
    const plugin = await this._pluginManager.getInstance(token) as IPluginContext<T>;

    return plugin.getContext();
  }

  /**
   * Resolves the values of the given context dependencies in order. Every
   * dependency is looked up in `_resolved` or created and cached there.
   * @param dependencies Context dependency tokens
   */
  private async _getDependenciesValues(dependencies: readonly InjectableIdentifier<any>[]): Promise<any[]> {
    return Promise.all(dependencies.map((id) => this.get(id)));
  }
}

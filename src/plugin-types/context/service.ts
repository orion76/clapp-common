import type { IPluginManager } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';
import { CONTEXT_MANAGER_TOKEN } from './di-tokens';
import { IContextService, IPluginContext, IPluginContextDefinition } from './types';

type IndexKey<M> = keyof M extends string ? keyof M : never

/**
 * Specialized DI container for application contexts: a core service (a facade
 * over the context plugin manager), not a plugin. The plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), not in `plugins/`.
 *
 * The contexts it resolves are plugins of type `PLUGIN_CONTEXT_TYPE` living in
 * `packages/common/src/plugins/context/**`.
 *
 * `get(id)` resolves the context plugin, satisfies its `dependencies` (other
 * context ids) and passes the dependency **values** to `getContext(...)` in
 * `dependencies` order. Non-context dependencies are injected through DI.
 *
 * Resolved context values are cached in `_resolved` (a Map of values, not
 * plugin instances): a repeated `get(id)` returns the cached value without
 * recreating the context. Cache refresh is out of scope.
 */
@injectable()
export class AppContext<M extends Record<string, unknown> = {}, K extends IndexKey<M> = IndexKey<M>> implements IContextService<M> {
  private readonly _resolved = new Map<string, unknown>();

  @inject(CONTEXT_MANAGER_TOKEN) private readonly _pluginManager!: IPluginManager<IPluginContext>;

  /**
   * Resolves the context plugin with the given id, satisfying its context
   * dependencies first, and returns its cached value.
   * @template T Resolved context value type
   * @param id Context id
   */
  async get<T>(token: string): Promise<T> {
    if (this._resolved.has(token)) {
      const context = this._resolved.get(token)
      if (!context) {
        throw new Error(``);
      }
      return context as T;
    }

    const definition = await this._pluginManager.getDefinition(token) as IPluginContextDefinition;
    await this._resolveDependencies(definition);

    const value = await this._getContext(token);
    this._resolved.set(token, value);
    return value as T;
  }

  /**
   * Creates every dependency context (if not already resolved) and caches its
   * value. The actual values are later passed to `getContext(...)` in
   * `dependencies` order.
   * @param definition Definition of the context whose dependencies to resolve
   */
  private async _resolveDependencies({ dependencies }: IPluginContextDefinition): Promise<void> {
    if (dependencies) {
      await Promise.all(dependencies.map((id) => this.get(id)));
    }
  }

  /**
   * Builds the context value by instantiating the context plugin and calling
   * `getContext(...)` with the values of its context dependencies in order.
   * @template T Resolved context value type
   * @param id Context id
   */
  private async _getContext<T>(id: string): Promise<T> {
    const plugin = await this._pluginManager.getInstance(id) as IPluginContext<M[K]>;
    const dependencies = plugin.definition.dependencies as K[];
    const args = dependencies ? await this._getDependenciesValues(dependencies) : [];
    return plugin.getContext(...(args)) as T;
  }

  /**
   * Resolves the values of the given context dependencies in order. Every
   * dependency is looked up in `_resolved` or created and cached there.
   * @param dependencies Context dependency ids
   */
  private async _getDependenciesValues(dependencies: K[]): Promise<unknown[]> {
    return Promise.all(dependencies.map((id) => this.get(id)));
  }
}

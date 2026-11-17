import type { IPluginManager } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';

import { CONTEXT_MANAGER_TOKEN } from './di-tokens';
import { getContextTokenId, type IContextService, type IPluginContext, type TContextIdentifier } from './types';

/**
 * Specialized DI container for application contexts: a core service (a facade
 * over the context plugin manager), not a plugin. The plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), not in `plugins/`.
 *
 * The contexts it resolves are plugins of type `PLUGIN_CONTEXT_TYPE` living in
 * `packages/common/src/plugins/context/**`.
 *
 * `get(token)` instantiates the context plugin addressed by the token and calls
 * its `getContext()`. The model is pull: a context takes no arguments and reads
 * the other contexts it needs from this service itself
 * (`this._context.get(TOKEN)`).
 *
 * Resolved context values are cached in `_resolved` (a Map of values, not
 * plugin instances): a repeated `get(token)` returns the cached value without
 * recreating the context. Cache refresh is out of scope.
 */
@injectable()
export class AppContext implements IContextService {
  private readonly _resolved = new Map<TContextIdentifier<unknown>, unknown>();

  @inject(CONTEXT_MANAGER_TOKEN) private readonly _pluginManager!: IPluginManager<IPluginContext>;

  /**
   * Returns the value of the context addressed by the token, from the cache when
   * it has been resolved already.
   * @template T Resolved context value type
   * @param token Context token
   */
  async get<T>(token: TContextIdentifier<T>): Promise<T> {
    if (this._resolved.has(token)) {
      return this._resolved.get(token) as T;
    }
    const value = await this._getContext(token);
    this._resolved.set(token, value);
    return value;
  }

  /**
   * Builds the context value: instantiates the context plugin of the token and
   * calls its `getContext()` without arguments.
   * @template T Resolved context value type
   * @param token Context token
   */
  private async _getContext<T>(token: TContextIdentifier<T>): Promise<T> {
    const plugin = await this._pluginManager.getInstance(getContextTokenId(token)) as IPluginContext<T>;

    return plugin.getContext();
  }
}

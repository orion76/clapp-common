import { NodePluginBase } from '@orion76/node-plugin';

import { InjectableIdentifier, IPluginContext, IPluginContextDefinition, TTokenValues } from './types';

/**
 * Base class for context plugins. A context contributes a value (process, cwd,
 * user home, app root) to the application context.
 *
 * The class itself is a core base class, not a plugin: the plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), while the concrete
 * context plugins live in `packages/common/src/plugins/context/**`.
 * @template C Context value
 * @template D Token tuple of the context dependencies; `getContext` argument
 *   types and order are derived from `D` via `TTokenValues<D>`
 */
export abstract class PluginContextBase<C, D extends readonly InjectableIdentifier<any>[] = []> extends NodePluginBase<IPluginContextDefinition<D>>
  implements IPluginContext<C, D> {
  abstract getContext(...args: TTokenValues<D>): Promise<C>;
}

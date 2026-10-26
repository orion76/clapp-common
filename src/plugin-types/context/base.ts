import { NodePluginBase } from '@orion76/node-plugin';

import type { IPluginContext, IPluginContextDefinition } from './types';

/**
 * Base class for context plugins. A context contributes a value (process, cwd,
 * user home, app root) to the application context.
 *
 * The class itself is a core base class, not a plugin: the plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), while the concrete
 * context plugins live in `packages/common/src/plugins/context/**`.
 * @template C Context value
 * @template A Context dependency values
 */
export abstract class PluginContextBase<C> extends NodePluginBase<IPluginContextDefinition>
  implements IPluginContext<C> {
  abstract getContext(...args: unknown[]): Promise<C>;
}

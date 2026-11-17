import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { CONTEXT_SERVICE_TOKEN } from './di-tokens';
import { IContextService, IPluginContext, IPluginContextDefinition } from './types';

/**
 * Base class for context plugins. A context contributes a value (process, cwd,
 * user home, app root) to the application context.
 *
 * The class itself is a core base class, not a plugin: the plugin loader never
 * discovers it, therefore it lives in `src/` (`src/context`), while the concrete
 * context plugins live in `packages/common/src/plugins/context/**`.
 *
 * The model is pull: `getContext()` takes no arguments, the context reads the
 * values it needs from the injected {@link IContextService} itself —
 * `this._context.get(TOKEN)`.
 * @template C Context value
 */
export abstract class PluginContextBase<C> extends NodePluginBase<IPluginContextDefinition>
  implements IPluginContext<C> {
  @inject(CONTEXT_SERVICE_TOKEN) protected readonly _context!:IContextService;

  abstract getContext(): Promise<C>;
}

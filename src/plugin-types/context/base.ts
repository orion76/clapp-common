import { NodePluginBase } from '@orion76/node-plugin';

import type { IPluginContext, IPluginContextDefinition } from './types';

/**
 * Base class of a context plugin: a plugin of type `PLUGIN_CONTEXT_TYPE` whose value
 * is provided to the DI container under the plugin token. Dependencies of a concrete
 * context come through `@inject(TOKEN)` into its fields.
 * @template C Context value
 */
export abstract class PluginContextBase<C>
  extends NodePluginBase<IPluginContextDefinition<C>>
  implements IPluginContext<C> {
  abstract getContext(): Promise<C>;
}

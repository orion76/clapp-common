import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import type { IClappLifecycleMap, IEventBus } from '../../types/events';
import type { ICommandResult, IPluginCommandDefinition } from '../command/types';
import type { ICommandArgumentState, IPluginCommandArgument, IPluginCommandArgumentDefinition } from './types';

/**
 * Base class of a command argument plugin — one step of the argument chain.
 *
 * A step rewrites the command definition before the host registers the command and
 * fills the arguments it can provide once the host has parsed the values. The
 * `definition` property is delivered by property injection from `NodePluginBase`:
 * a concrete step declares neither a constructor nor `@inject(PLUGIN_DEFINITION)`.
 */
export abstract class PluginCommandArgumentBase
  extends NodePluginBase<IPluginCommandArgumentDefinition>
  implements IPluginCommandArgument
{
  /**
   * Shared asynchronous event bus, delivered by the DI container through
   * property injection. `@NodePlugin` copies this injection into every concrete
   * plugin via `injectFromHierarchy()`, so plugins use `this._events` directly
   * and do not declare their own constructor or event helpers.
   */
  @inject(EVENT_BUS_TOKEN)
  protected _events!: IEventBus<IClappLifecycleMap>;

  abstract transformDefinition(definition: IPluginCommandDefinition): IPluginCommandDefinition;

  abstract fill(state: ICommandArgumentState): Promise<ICommandResult<Record<string, unknown>>>;
}

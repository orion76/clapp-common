import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IClappLifecycleMap, IEventBus } from '../../types/events';
import { IPluginCommandArgumentDefinition, ICommandArgumentResult, IPluginCommandArgument } from './types';


/**
 * Command plugin instance
 * Handles command registration and execution using the plugin system
 * @template A Command arguments
 * @template E Plugin-specific lifecycle map
 */
export abstract class PluginCommandArgumentBase<A = {}, C = {}>
  extends NodePluginBase<IPluginCommandArgumentDefinition<A, C>>
  implements IPluginCommandArgument<A, C>
{
  /**
   * Shared asynchronous event bus, delivered by the DI container through
   * property injection. `@NodePlugin` copies this injection into every concrete
   * plugin via `injectFromHierarchy()`, so plugins use `this._events` directly
   * and do not declare their own constructor or event helpers.
   */
  @inject(EVENT_BUS_TOKEN)
  protected _events!: IEventBus<IClappLifecycleMap>;

  /**
   * Action handler invoked with the parsed operands and options, plus an array
   * of context values required by the command.
   * @param args Positional and named operands declared by the command definition
   * @param contexts Array of context values corresponding to the command's `contexts` declaration
   */
  abstract action(args: A, contexts: C): Promise<ICommandArgumentResult>;

}

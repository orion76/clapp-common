import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IClappLifecycleMap, IEventBus } from '../../types/events';
import { ICommandResult, IPluginCommand, IPluginCommandDefinition } from './types';

export abstract class PluginCommandBase<A = {}, D = unknown>
  extends NodePluginBase<IPluginCommandDefinition<A>>
  implements IPluginCommand<A, D> {

  @inject(EVENT_BUS_TOKEN) protected _events!: IEventBus<IClappLifecycleMap>;

  abstract action(args: A): Promise<ICommandResult<D>>;
}

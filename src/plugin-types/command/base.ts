import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IClappLifecycleMap, IEventBus } from '../../types/events';
import { ICommandResult, IPluginCommand, IPluginCommandDefinition } from './types';
import { collectCommandValues } from './values';


export abstract class PluginCommandBase<A = {}, D = unknown>
  extends NodePluginBase<IPluginCommandDefinition<A>>
  implements IPluginCommand<A, D> {

  @inject(EVENT_BUS_TOKEN) protected _events!: IEventBus<IClappLifecycleMap>;

  abstract action(args: A): Promise<ICommandResult<D>>;
  async getArguments(args: string[], opts: Record<string, unknown>): Promise<A> {
    const values = collectCommandValues(this.definition.config, { args, opts });

    return values as unknown as A;
  }
}

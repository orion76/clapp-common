import { NodePluginBase } from '@orion76/node-plugin';
import { inject } from 'inversify';

import { EVENT_BUS_TOKEN } from '../../tokens';
import { IClappLifecycleMap, IEventBus } from '../../types/events';
import { ICommandResult, IPluginCommand, IPluginCommandDefinition } from './types';


export abstract class PluginCommandBase<A = {}, C extends Record<string, unknown> = {}>
  extends NodePluginBase<IPluginCommandDefinition<A>>
  implements IPluginCommand<A, C> {

  @inject(EVENT_BUS_TOKEN) protected _events!: IEventBus<IClappLifecycleMap>;

  abstract action(args: A): Promise<ICommandResult>;
  async getArguments<O extends object = object>(args: string[], opts: O): Promise<A> {
    const _args = { ...opts } as Record<string, any>;
    if (this.definition.config.arguments) {
      this.definition.config.arguments.forEach((arg, index) => {
        const { name } = arg;
        _args[name] = args[index];
      });
    }
    return _args as A;
  }
}

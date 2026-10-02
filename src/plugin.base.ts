import { PluginBase } from '@orion76/plugin';
import { IPluginCommand, IPluginCommandDefinition, ICommandResult } from './types';

/**
 * Command plugin instance
 * Handles command registration and execution using the plugin system
 */
export abstract class PluginCommandBase<A = {}> extends PluginBase implements IPluginCommand<A> {
  constructor(public definition: IPluginCommandDefinition) {
    super();
  }
  abstract action(args: A): ICommandResult | Promise<ICommandResult>;
  getArguments<O extends object = object>(args: string[], opts: O): A {
    const _args = { ...opts } as Record<string, any>;
    if (this.definition.command.arguments) {
      this.definition.command.arguments.forEach((arg, index) => {
        const { name } = arg;
        _args[name] = args[index];
      });
    }
    return _args as A;
  }
}

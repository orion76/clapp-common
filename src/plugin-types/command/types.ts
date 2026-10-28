import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from '../../types/commander';
import { UCommandDefinitionKind } from '../types';
import { IContextService } from '../context';
import { Command } from 'commander';
import { IAppConfig, IClappLifecycleMap, ILifecycle } from '../../types';



export interface ICommandConfig {
  arguments?: ICommandArgument[];
  options?: ICommandOption[];
  aliases?: string[];
  description?: string;
}

export interface IPluginCommandDefinition<A = {}> extends IPluginDefinition {
  command: string;
  kind: UCommandDefinitionKind;
  parent?: string;
  formatter?: string;
  config: ICommandConfig;
  pluginClass: IType<IPluginCommand<A>>;
}

export type IPluginCommandDefinitionData<A = {}> = Omit<IPluginCommandDefinition<A>, 'pluginClass'>;

export interface IPluginCommand<A = {}, C extends Record<string, unknown> = {}> extends IPlugin {
  definition: IPluginCommandDefinition<A>;
  getArguments: (args: string[], opts: Record<string, unknown>) => Promise<A>;
  action(args: A): Promise<ICommandResult>;
}
/**
 * Single command definition type. Kept as an alias for backward compatibility;
 * `IPluginCommandDefinition` is the only command definition shape now.
 */
export type UPluginCommandDefinition = IPluginCommandDefinition;

/**
 * Result of a command action.
 *
 * A command that declares a `formatter` returns the data to render in `data`;
 * the core passes it to the formatter plugin and prints the returned string.
 * Commands without a formatter keep printing their own output and leave `data`
 * unset.
 * @template D Type of the data handed to the formatter; `unknown` by default
 */
export interface ICommandResult<D = unknown> {
  success: boolean;
  error?: string[];
  /** Data for the formatter declared by the command definition. */
  data?: D;
}
export interface ICommandService {
  createProgram(config: IAppConfig): Command;
  createAppCommands(program: Command, context: IContextService): Promise<void>;
}

export type TEventName = keyof IClappLifecycleMap;
export type TEventArgs<N extends TEventName> = IClappLifecycleMap[N]['data'];



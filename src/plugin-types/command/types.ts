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
/**
 * Renders the result of a command that declares a formatter.
 *
 * Implemented by the engine that owns the formatter manager and passed to
 * `ICommandService.createAppCommands`, so `@clapp/common` keeps no core dependency.
 * @param definition Definition of the command whose action produced the result
 * @param result Result returned by the command action
 */
export type TCommandResultRenderer = (definition: IPluginCommandDefinition, result: ICommandResult) => Promise<void>;

export interface ICommandService {
  createProgram(config: IAppConfig): Command;
  /**
   * Registers the commands of the discovered command plugins in the program.
   * @param program Commander program the commands are registered in
   * @param context Application contexts; accepted for the contract, not passed to commands yet
   * @param renderResult Renders the result of a command that declares a formatter
   */
  createAppCommands(program: Command, context: IContextService, renderResult: TCommandResultRenderer): Promise<void>;
}

export type TEventName = keyof IClappLifecycleMap;
export type TEventArgs<N extends TEventName> = IClappLifecycleMap[N]['data'];



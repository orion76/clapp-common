import { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';
import { ICommandArgument, ICommandOption } from '../../types/commander';
import { UCommandDefinitionKind } from '../types';
import { Command } from 'commander';
import { IAppConfig } from '../../types';



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

export interface IPluginCommand<A = {}, D = unknown> extends IPlugin {
  definition: IPluginCommandDefinition<A>;
  getArguments: (args: string[], opts: Record<string, unknown>) => Promise<A>;
  action(args: A): Promise<ICommandResult<D>>;
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
   * @param renderResult Renders the result of a command that declares a formatter
   */
  createAppCommands(program: Command, renderResult: TCommandResultRenderer): Promise<void>;
}

/**
 * Input of the command pipeline whose values are addressed by position: what a host parses
 * from a command line.
 *
 * A positional argument is matched by its index in `config.arguments`, so a value the user
 * left out keeps its place with an `undefined` entry.
 */
export interface ICommandPositionalInput {
  /** Positional values in the order the command declares its arguments. */
  args: readonly unknown[];
  /** Options by name, as the host parsed them. */
  opts: Record<string, unknown>;
}

/**
 * Input of the command pipeline whose values are addressed by name: what an MCP call
 * delivers, and what an action finally receives.
 */
export interface ICommandValuesInput {
  /** Values by the argument and option names the command declares. */
  values: Record<string, unknown>;
}

/**
 * Input of the command pipeline. The hosts differ in the shape they parse — the CLI hands
 * over a positional array with options, the MCP server a ready object of named values — and
 * in nothing else: the pipeline itself is the same.
 */
export type UCommandPipelineInput = ICommandPositionalInput | ICommandValuesInput;

/**
 * Outcome of applying the patch of one argument chain step over the values of a command.
 *
 * A step reports the values it filled rather than the whole value object, so the applied
 * patch also tells which arguments the host already had: those values are never replaced by
 * a filled one.
 */
export interface IAppliedArgumentPatch {
  /** Values of the command with the patch applied. */
  values: Record<string, unknown>;
  /** Values the step provided, by argument name. */
  filled: Record<string, unknown>;
  /** Values the step proposed for arguments the host had already filled, by argument name. */
  kept: Record<string, unknown>;
}

/**
 * What one step of the argument chain did with the values of one command: the payload of the
 * debug report of the chain.
 */
export interface IArgumentFillReport {
  /** Command the values belong to, by plugin id. */
  command: string;
  /** Id of the chain step that produced the values. */
  step: string;
  /** Values the step provided, by argument name. */
  filled: Record<string, unknown>;
  /** Values the step proposed for arguments the host had already filled, by argument name. */
  kept: Record<string, unknown>;
}

/**
 * Runner of a command: the single pipeline of every host of the application.
 *
 * The pipeline is definition override → `command:start` → plugin instance →
 * `command:arguments` → argument chain → validation → `command:run` → `action` →
 * `command:end` / `command:error`. A host renders the result in its own way — the CLI
 * through the formatter to stdout, the MCP server through the formatter to the protocol —
 * but it does not execute the command itself, so the lifecycle hooks and the argument
 * handling cannot drift apart between the hosts.
 */
export interface ICommandRunner {
  /**
   * Applies the argument chain to a copy of a command definition: the phase that runs before
   * the host registers the command, so an argument the chain fills is declared optional on
   * the surface.
   * @param definition Definition of the command as the manager caches it
   * @returns Definition the host registers and hands to `run`
   */
  prepareDefinition(definition: IPluginCommandDefinition): Promise<IPluginCommandDefinition>;
  /**
   * Runs the command of a definition and reports what it produced.
   *
   * A value the chain cannot provide and a definition the values do not satisfy are reported
   * as a failed result with the reasons in `error`, so a host turns them into its own failure
   * output instead of facing an action that receives `undefined`.
   * @param definition Definition of the command; the chain is applied to it unless the host
   * has already prepared it for registration
   * @param input Values as the host parsed them
   * @returns Result of the command action, or a failed result naming why it did not run
   */
  run(definition: IPluginCommandDefinition, input: UCommandPipelineInput): Promise<ICommandResult>;
}

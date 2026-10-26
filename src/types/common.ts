import { ILoggerConfig } from '@orion76/logger';
import { IPluginCommandDefinition, PLUGIN_COMMAND_ARGUMENT_TYPE, PLUGIN_CONTEXT_TYPE, PLUGIN_FORMATTER_TYPE } from '../plugin-types';
import { PLUGIN_COMMAND_TYPE } from '../plugin-types/command/constants';
import { IPluginDiscoveryConfig } from './plugin-config';

export interface IClapp {
  run(argv?: string[]): Promise<void>;
}
export interface Type<T> extends Function {
  new (...args: any[]): T;
}
export type UPluginTypes =
  | typeof PLUGIN_COMMAND_TYPE
  | typeof PLUGIN_COMMAND_ARGUMENT_TYPE
  | typeof PLUGIN_CONTEXT_TYPE
  | typeof PLUGIN_FORMATTER_TYPE;
/**
 * CLI application configuration
 */
export interface IAppConfig {
  name: string;
  description: string;
  version: string;
  plugins: Record<UPluginTypes, IPluginDiscoveryConfig>;
  loggers: Record<ULoggerNames, ILoggerConfig>;
}

/**
 * Node of the command hierarchy built from the flat definition list.
 * Nodes with children are groups; leaf nodes are executable commands.
 */
export interface ICommandNode {
  definition: IPluginCommandDefinition;
  children: ICommandNode[];
}

export interface IInitAppOptions {
  configPath?: string;
}

/**
 * Names of the loggers registered by `@clapp/core`.
 */
export type ULoggerNames = 'clapp_cli';

export interface ICommandExecArguments {
  name: string;
  args: string[];
  opts: Record<string, string>;
}
/**
 * Supported JavaScript/TypeScript runtimes a CLI application may run under.
 */
export type TAppRuntime = 'node' | 'tsx' | 'bun' | 'deno';


/**
 * Configuration override of a CLI application: the same shape as `IAppConfig`,
 * but the plugin and logger sections are optional and the plugin section is
 * validated and completed with the defaults while the config is loaded.
 */
export type TCliConfigCustom = Omit<IAppConfig, 'plugins' | 'loggers'> & {
  plugins?: Record<UPluginTypes, IPluginDiscoveryConfig>;
  loggers?: Record<ULoggerNames, ILoggerConfig>;
};
export interface IEngine {
  run(argv: readonly string[]): Promise<void>;
  initialize(): Promise<void>;
}

import { ILoggerConfig } from '@orion76/logger';
import { IPluginCommandDefinition, PLUGIN_COMMAND_ARGUMENT_TYPE, PLUGIN_CONTEXT_TYPE, PLUGIN_FORMATTER_TYPE } from '../plugin-types';
import { PLUGIN_COMMAND_TYPE } from '../plugin-types/command/constants';
import { IPluginDiscoveryConfig, UPluginSourceConfig } from './plugin-config';

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
 * Data schemas of the application: the sources their files come from plus the map from a
 * schema `$id` to the formatter plugin that renders the data it describes.
 *
 * A command names the shape of its data with `dataSchema`, and this map decides how that data
 * is rendered, so a command stays independent of the formatter set a host loads.
 */
export interface ISchemaConfig {
  /** Sources of the schema files; their patterns are resolved the same way as plugin sources. */
  sources: UPluginSourceConfig[];
  /** Formatter plugin id by the `$id` of the data schema it renders. */
  formatters: Record<string, string>;
}

/**
 * CLI application configuration
 */
export interface IAppConfig {
  name: string;
  description: string;
  version: string;
  plugins: Record<UPluginTypes, IPluginDiscoveryConfig>;
  loggers: Record<ULoggerNames, ILoggerConfig>;
  schemas: ISchemaConfig;
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

/**
 * Supported JavaScript/TypeScript runtimes a CLI application may run under.
 */
export type TAppRuntime = 'node' | 'tsx' | 'bun' | 'deno';


/**
 * Configuration override of a CLI application: the same shape as `IAppConfig`,
 * but the plugin, logger and schema sections are optional. Every absent section
 * keeps its default, and a declared one is validated and completed with the
 * defaults while the config is loaded.
 */
export type TCliConfigCustom = Omit<IAppConfig, 'plugins' | 'loggers' | 'schemas'> & {
  plugins?: Record<UPluginTypes, IPluginDiscoveryConfig>;
  loggers?: Record<ULoggerNames, ILoggerConfig>;
  schemas?: ISchemaConfig;
};
export interface IEngine {
  run(argv: readonly string[]): Promise<void>;
  initialize(): Promise<void>;
}

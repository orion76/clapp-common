import { IPluginDefinition, IPlugin } from '@orion76/plugin';

/**
 * Formatter plugin definition. A formatter declares nothing beyond the base plugin fields:
 * which data it renders is decided by the app config map from the `$id` of a command data
 * schema to the formatter id, so the same formatter serves any schema whose data it can render.
 */
export interface IPluginFormatterDefinition extends IPluginDefinition {}
/**
 * Formatter plugin instance: turns data into a string. Which styling the string
 * carries is up to the formatter set a host configures — the terminal formatters
 * write for a terminal, the MCP formatters write for the protocol stream.
 * Formatting is asynchronous to stay uniform with the other plugin types
 * (commands, contexts) and to leave room for implementations that need to
 * inspect the environment before rendering.
 * @template D Input data type
 */
export interface IPluginFormatter<D = unknown> extends IPlugin {
  definition: IPluginFormatterDefinition;
  format(data: D): Promise<string>;
}

/**
 * Authoring-time formatter definition. `pluginClass` is attached by the
 * `@NodePlugin` decorator, so it is omitted from the object the author writes.
 */
export type IPluginFormatterDefinitionData = Omit<IPluginFormatterDefinition, 'pluginClass'>;

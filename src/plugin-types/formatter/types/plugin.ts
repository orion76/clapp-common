import { IPluginDefinition, IPlugin } from '@orion76/plugin';

/**
 * Formatter plugin definition. Besides the base plugin fields a formatter
 * declares its `kind` — the data shape it renders, for example `table` or
 * `ordered-list`. The value is an open string, so a new kind does not require
 * changes in this package.
 * @template K Formatter kind
 */
export interface IPluginFormatterDefinition<K extends string = string> extends IPluginDefinition {
  kind: K;
}
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
 * @template K Formatter kind
 */
export type IPluginFormatterDefinitionData<K extends string = string> = Omit<IPluginFormatterDefinition<K>, 'pluginClass'>;

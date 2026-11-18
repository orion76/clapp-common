/**
 * Built-in terminal formatter set of `@clapp/common`: the formatters shipped with
 * the library that render a command result for a terminal. A host opts into the
 * set by adding its modules to the discovery patterns of `PLUGIN_FORMATTER_TYPE`.
 * The MCP set sits next to it in `src/plugins/formatter/mcp`; the base class of a
 * formatter plugin is exported from `src/plugin-types/formatter`.
 */

export * from './table/table.plugin';
export * from './ordered-list/ordered-list.plugin';
export * from './key-value/key-value.plugin';

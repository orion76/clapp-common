/**
 * Formatter plugin type: a formatter turns data into a string (see
 * `IPluginFormatter`). A host picks a formatter set by the discovery patterns
 * of this type. All sets share the type and the plugin contract and differ in
 * their output and in their modules: the terminal formatters write for a
 * terminal, the MCP formatters write for the protocol stream of an MCP server.
 */
export const PLUGIN_FORMATTER_TYPE = 'PLUGIN_FORMATTER';
export const PLUGIN_COMMAND_TYPE = 'PLUGIN_COMMAND';
export const PLUGIN_CONTEXT_TYPE = 'PLUGIN_CONTEXT';
export const PLUGIN_ARGUMENT_TYPE = 'PLUGIN_ARGUMENT';


/**
 * Command kind: a query for information (project data or state) without side
 * effects. Maps to the MCP Resources surface (`resources/list`, `resources/read`).
 */
export const COMMAND_KIND_RESOURCE = 'resource';
/**
 * Command kind: an action in the project within a workflow, with side effects.
 * Maps to the MCP Tools surface (`tools/list`, `tools/call`).
 */
export const COMMAND_KIND_TOOL = 'tool';
/**
 * Command kind: an instruction sent to the model together with its arguments.
 * Maps to the MCP Prompts surface (`prompts/list`, `prompts/get`).
 */
export const COMMAND_KIND_PROMPT = 'prompt';
/**
 * Command kind marker for a group node: a container that only groups
 * subcommands and has no surface of its own, so it is never mapped to MCP.
 */
export const COMMAND_KIND_GROUP = 'group';

/**
 * Formatter plugin type: a formatter turns data into a string (see
 * `IPluginFormatter`). A host picks a formatter set by the discovery patterns
 * of this type. All sets share the type and the plugin contract and differ in
 * their output and in their modules: the terminal formatters write for a
 * terminal, the MCP formatters write for the protocol stream of an MCP server.
 */
export const PLUGIN_FORMATTER_TYPE = 'PLUGIN_FORMATTER';


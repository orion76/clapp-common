export const PLUGIN_COMMAND_TYPE = 'PLUGIN_COMMAND';
export const PLUGIN_CONTEXT_TYPE = 'PLUGIN_CONTEXT';
export const PLUGIN_ARGUMENT_TYPE = 'PLUGIN_ARGUMENT';
/**
 * Formatter plugin type: a formatter turns data into a string ready for the
 * terminal (see `IPluginFormatter`).
 */
export const PLUGIN_FORMATTER_TYPE = 'PLUGIN_FORMATTER';

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

/** The three kinds of a project command, each matching an MCP surface. */
export type UCommandKind = typeof COMMAND_KIND_RESOURCE | typeof COMMAND_KIND_TOOL | typeof COMMAND_KIND_PROMPT;

/** Value of the `kind` field in a command definition: a command kind or the group marker. */
export type UCommandDefinitionKind = UCommandKind | typeof COMMAND_KIND_GROUP;

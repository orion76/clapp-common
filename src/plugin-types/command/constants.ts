export const PLUGIN_COMMAND_TYPE = 'PLUGIN_COMMAND';

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

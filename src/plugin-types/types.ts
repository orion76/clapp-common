import { COMMAND_KIND_RESOURCE, COMMAND_KIND_TOOL, COMMAND_KIND_PROMPT, COMMAND_KIND_GROUP } from "./constants";

/** The three kinds of a project command, each matching an MCP surface. */
export type UCommandKind = typeof COMMAND_KIND_RESOURCE | typeof COMMAND_KIND_TOOL | typeof COMMAND_KIND_PROMPT;

/** Value of the `kind` field in a command definition: a command kind or the group marker. */
export type UCommandDefinitionKind = UCommandKind | typeof COMMAND_KIND_GROUP;


/**
 * Built-in formatter plugins of `@clapp/common` — both sets of the `formatter` plugin type:
 * the terminal set of `./terminal` and the MCP set of `./mcp`. Their plugin ids are the
 * same, so a host loads one set at a time, by the discovery patterns of its config.
 */

export * from './terminal';
export * from './mcp';

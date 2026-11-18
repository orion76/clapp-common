/**
 * Standard step of the command argument chain shipped with `@clapp/common`: the table of
 * the arguments it fills from the application contexts, and the plugin module a host points
 * its discovery patterns at (`src/plugins/command-argument`).
 */

export * from './types';
export * from './project.arguments';
export * from './argument-contexts';
export * from './context-arguments/context-arguments.plugin';

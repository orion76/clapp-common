/**
 * Names of the arguments that address a project. A chain step refers to these constants
 * instead of repeating the literal, so a renamed argument has one place to change.
 */

/** Project a command works on: name of a project or `root` as the scope selector. */
export const PROJECT_ARG = 'project';

/** Name of the project the command runs in, without the `root` scope selector. */
export const PROJECT_NAME_ARG = 'project-name';

/** Absolute path of the project root. */
export const PROJECT_PATH_ARG = 'project-path';

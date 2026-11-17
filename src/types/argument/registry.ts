import { PROJECT_ARG, PROJECT_NAME_ARG, PROJECT_PATH_ARG } from './project.args';
import { TASK_NAME_ARG } from './task.args';

/**
 * Argument names the plugins of the monorepo address: every name a chain step declares
 * in the table of its definition must be registered here, so a typo in a shared constant
 * fails at startup instead of leaving the step matching no argument at all.
 */
export const ARGUMENT_REGISTRY: readonly string[] = [PROJECT_ARG, PROJECT_NAME_ARG, PROJECT_PATH_ARG, TASK_NAME_ARG];

import { PROJECT_ARGUMENT_CONTEXTS } from './project.arguments';
import type { TArgumentContextTable } from './types';

/**
 * Table of the standard argument step: every argument the step fills and the context that
 * provides its value. A new argument domain is a module of its own, added here.
 */
export const ARGUMENT_CONTEXTS: TArgumentContextTable = [...PROJECT_ARGUMENT_CONTEXTS];

/**
 * Names of the arguments the step fills. Declared in the plugin definition, so the startup
 * check compares them with the argument registry without resolving a plugin instance.
 */
export const ARGUMENT_CONTEXT_NAMES: readonly string[] = ARGUMENT_CONTEXTS.map((binding) => binding.argument);

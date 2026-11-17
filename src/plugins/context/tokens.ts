import { contextToken, type TContextIdentifier } from '../../plugin-types/context/types';

/**
 * Context tokens — symbols addressing the values of the context plugins living in
 * `packages/common/src/plugins/context/**`. The runtime value of a token is a
 * unique symbol whose description repeats the plugin `id`; the id itself stays in
 * the plugin definition, which is the only place where a context has a string name.
 */

/** Token of the `app-root` context. Value: absolute path of the app root. */
export const APP_ROOT: TContextIdentifier<string> = contextToken<string>('app-root');

/** Token of the `current-project-path` context. Value: absolute project root. */
export const CURRENT_PROJECT_PATH: TContextIdentifier<string> = contextToken<string>('current-project-path');

/** Token of the `cwd` context. Value: current working directory. */
export const CWD: TContextIdentifier<string> = contextToken<string>('cwd');

/** Token of the `process` context. Value: the current Node.js process. */
export const PROCESS: TContextIdentifier<NodeJS.Process> = contextToken<NodeJS.Process>('process');

/** Token of the `project` context. Value: name of the context project. */
export const PROJECT_PATH: TContextIdentifier<string> = contextToken<string>('project');

/** Token of the `user-home` context. Value: user home directory. */
export const USER_HOME: TContextIdentifier<string> = contextToken<string>('user-home');

/**
 * All built-in context tokens: the set the host binds into the container as lazy
 * accessors, so a plugin reaches a context value through `@inject(TOKEN)`.
 */
export const CONTEXT_TOKENS: readonly TContextIdentifier<unknown>[] = [
  APP_ROOT,
  CURRENT_PROJECT_PATH,
  CWD,
  PROCESS,
  PROJECT_PATH,
  USER_HOME,
];

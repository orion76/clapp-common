import { contextToken, type InjectableIdentifier } from '../../plugin-types/context/types';

/**
 * Context tokens — branded string identifiers of the context plugins living in
 * `packages/common/src/plugins/context/**`. Their runtime value is the token id
 * (a plain string); the brand carries the value type for typed `getContext` args.
 */

/** Token of the `app-root` context. Value: absolute path of the app root. */
export const APP_ROOT: InjectableIdentifier<string> = contextToken<string>('app-root');

/** Token of the `current-project-path` context. Value: absolute project root. */
export const CURRENT_PROJECT_PATH: InjectableIdentifier<string> = contextToken<string>('current-project-path');

/** Token of the `cwd` context. Value: current working directory. */
export const CWD: InjectableIdentifier<string> = contextToken<string>('cwd');

/** Token of the `process` context. Value: the current Node.js process. */
export const PROCESS: InjectableIdentifier<NodeJS.Process> = contextToken<NodeJS.Process>('process');

/** Token of the `project` context. Value: name of the context project. */
export const PROJECT_PATH: InjectableIdentifier<string> = contextToken<string>('project');

/** Token of the `user-home` context. Value: user home directory. */
export const USER_HOME: InjectableIdentifier<string> = contextToken<string>('user-home');

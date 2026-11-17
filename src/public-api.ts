/**
 * Public API of `@clapp/common`: plugin contracts and base classes, shared
 * tokens and constants used by the packages of the monorepo.
 */

// Re-export all types and interfaces
export * from './tokens';
export * from './types';

// Formatter data types - re-exported from plugin-types/formatter
export * from './plugin-types';

// Event bus: lifecycle contracts and the default implementation
export * from './events';

// Context tokens: each context plugin module owns its token, and the token is the id of the plugin.
// Those modules are evaluated here, so they import the package internals by relative paths: an
// import of this entry point back would close a cycle, and an `@inject(TOKEN)` of a context would
// read a value still in its temporal dead zone.
export { APP_ROOT } from './plugins/context/app-root/app-root.context';
export { CURRENT_PROJECT_PATH } from './plugins/context/current-project-root/current-project-root.context';
export { CWD } from './plugins/context/cwd/cwd.context';
export { PROCESS } from './plugins/context/process/process.context';
export { PROJECT_PATH } from './plugins/context/project-name/project.context';
export { USER_HOME } from './plugins/context/user-home/user-home.context';

// App meta (library shared with the context plugins)
export * from './plugins/context/app-meta';


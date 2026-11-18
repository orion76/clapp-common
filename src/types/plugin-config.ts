/**
 * Plugin discovery configuration of one plugin type.
 *
 * A plugin type (`command`, `command-argument`, `context`, `formatter`) is not
 * described by a flat list of patterns anymore: its plugins come from
 * **sources**, each anchored at its own root, and every source (and the type
 * itself) can disable single plugin ids.
 *
 * ```yaml
 * plugins:
 *   command:
 *     # Type-level list: an id disabled here is not loaded from any source.
 *     disabled: []
 *     sources:
 *       # `@clapp/ai-workflow-plugins` is resolved from the application root,
 *       # patterns are relative to the directory of that package.
 *       - type: library
 *         library: '@clapp/ai-workflow-plugins'
 *         patterns:
 *           - src/plugins/command/**\/*.plugin.{js,ts}
 *         disabled: []
 *       # Plugins of the project the launcher runs in: `plugins/` in its root.
 *       - type: project
 *         patterns:
 *           - plugins/command/**\/*.plugin.{js,ts}
 *         disabled: []
 *   formatter:
 *     disabled: []
 *     sources:
 *       # The built-in terminal formatters are per-file plugin modules of `@clapp/common`
 *       # (`packages/common/src/plugins/formatter/terminal/**`), patterns are relative to it.
 *       - type: library
 *         library: '@clapp/common'
 *         patterns:
 *           - src/plugins/formatter/terminal/**\/*.plugin.{js,ts}
 *         disabled: []
 * ```
 */

/**
 * Kind of a plugin source: the root its `patterns` are resolved against.
 *
 * - `appRoot` — the root of the launcher application, the package that holds
 *   `clapp.config.yml` (never `process.cwd()`);
 * - `path` — the directory named by {@link IPluginSourcePathConfig.path}, resolved
 *   from the application root. No `node_modules` resolution happens, so the plugins
 *   of a monorepo checkout are loaded from its sources, and an absent directory is
 *   not an error: the source is simply empty;
 * - `library` — the directory of the npm package named by
 *   {@link IPluginSourceConfig.library}. The package is resolved from the
 *   application root through the Node.js resolution algorithm, so npm-workspaces
 *   hoisting and monorepo layouts work without relative paths;
 * - `project` — the root of the project the launcher runs in: the nearest
 *   directory with a `package.json` above the working directory. The plugins of
 *   the project are an auxiliary tool of the developer, not a part of the
 *   launcher, so they live in `plugins/**` in the project root.
 */
export type UPluginSourceType = 'appRoot' | 'path' | 'library' | 'project';

/**
 * Single source of plugin modules of one plugin type.
 */
export interface IPluginSourceConfig {
  type: UPluginSourceType;
  patterns: string[];
  /** Plugin ids this source does not load; an id disabled for the type is dropped from every source. */
  disabled?: string[];
}

export interface IPluginSourceLibraryConfig extends IPluginSourceConfig {
  type: 'library';
  library: string;
}

/**
 * Source anchored at a directory of the file system, used in development to load
 * the plugins of a monorepo package from its sources instead of its installed copy.
 * `path` is resolved relative to the directory of the config file (the application
 * root), an absolute path is taken as-is.
 */
export interface IPluginSourcePathConfig extends IPluginSourceConfig {
  type: 'path';
  path: string;
}

export type UPluginSourceConfig = IPluginSourceConfig | IPluginSourceLibraryConfig | IPluginSourcePathConfig;

/**
 * Discovery configuration of one plugin type: the sources its definitions come
 * from plus the ids disabled for the whole type.
 */
export interface IPluginDiscoveryConfig {
  sources: UPluginSourceConfig[];
  /** Plugin ids disabled for the whole type: they are not loaded from any of its sources. */
  disabled?: string[];
}

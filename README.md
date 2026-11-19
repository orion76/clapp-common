> ⚠️ **Work in progress.** This package is under active development. A release is expected soon, but it is **not production-ready** yet: the API may change without notice. Do not use it in production.

> ⚠️ **В разработке.** Пакет ещё не готов к релизу: релиз ожидается в ближайшее время, API может меняться. Использовать в продакшне пока нельзя.

**English** | [Русский](./docs/ru/README.md)

# @clapp/common

The package is published from its own repository, [`orion76/clapp-common`](https://github.com/orion76/clapp-common); it is developed together with the `clapp` host and its dev sample app ([`orion76/clapp`](https://github.com/orion76/clapp)).

Shared contracts of the `clapp` CLI framework: the types, base classes, plugin-type constants and DI tokens the other `@clapp/*` packages are built on. The package holds no business logic of its own — it is the vocabulary that `@clapp/core`, the plugins and the hosts speak.

## Features

- **Command plugin contracts** — `IPluginCommandDefinition`, `IPluginCommand`, `ICommandConfig`, `ICommandResult` and the `PluginCommandBase` base class; the values of a command are collected by `CommandRunner` from the `config` of its definition.
- **Plugin types and command kinds** — the constants `PLUGIN_COMMAND_TYPE`, `PLUGIN_COMMAND_ARGUMENT_TYPE`, `PLUGIN_CONTEXT_TYPE`, `PLUGIN_FORMATTER_TYPE` and the kinds `COMMAND_KIND_TOOL`, `COMMAND_KIND_RESOURCE`, `COMMAND_KIND_PROMPT`, `COMMAND_KIND_GROUP`.
- **Formatter data contracts** — `ITableData`, `IOrderedListData`, `IKeyValueData`, the `UFormatterKind` union, `IFormatterDataMap` / `TFormatterData<K>` and `PluginFormatterBase`.
- **Context plugins** — `IContextService`, `IPluginContext` and branded `contextToken()` identifiers, plus the built-in contexts `cwd`, `app-root`, `user-home`, `process`, `project` and `current-project-path`.
- **Built-in formatter plugins** — two sets of the `formatter` plugin type: the terminal formatters `table`, `ordered-list`, `key-value` (`src/plugins/formatter/terminal/**`) and their MCP counterparts (`src/plugins/formatter/mcp/**`), discovered by the hosts as per-file plugin modules.
- **Event bus** — asynchronous lifecycle hooks (`IEventBus`, `EventBus`, `IClappLifecycleMap`, `ILifecycle`, `THookListener`) for `command:start`, `command:arguments`, `command:run`, `command:end` and `command:error`.
- **Application config and DI tokens** — `IAppConfig`, `TCliConfigCustom`, `IPluginDiscoveryConfig` with its `appRoot` / `library` / `project` sources, and the tokens `EVENT_BUS_TOKEN`, `COMMAND_MANAGER_TOKEN`, `FORMATTER_MANAGER_TOKEN`, `CONTEXT_SERVICE_TOKEN`.
- **Application meta** — `initAppMeta()` / `getAppMeta()` with the resolved `cwd`, `appPath`, `appRoot` and `userHome` of the running CLI.

## Installation

The package is not published to npm yet, so `npm install @clapp/common` does not resolve until the first release. Until then it is consumed as a workspace package of the `clapp` host workspace ([`orion76/clapp`](https://github.com/orion76/clapp)):

```bash
npm install @clapp/common
```

## Usage

A command plugin describes itself with `@NodePlugin` and implements the contract through `PluginCommandBase`; the result is returned as formatter data instead of being printed by the plugin itself:

```ts
import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import {
  COMMAND_KIND_TOOL,
  PLUGIN_COMMAND_TYPE,
  PluginCommandBase,
  type ICommandResult,
  type IPluginCommandDefinitionData,
  type TFormatterData,
} from '@clapp/common';

interface IStatusConfig {
  verbose?: boolean;
}

@NodePlugin<IPluginCommandDefinitionData<IStatusConfig>>({
  type: PLUGIN_COMMAND_TYPE,
  kind: COMMAND_KIND_TOOL,
  id: 'status',
  command: 'status',
  label: 'Print the project status',
  formatter: 'key-value',
  config: {
    description: 'Print the project status',
    options: [{ name: 'verbose', description: 'Show every field', type: 'boolean' }],
  },
})
@injectable()
export class StatusCommandPlugin extends PluginCommandBase<IStatusConfig> {
  async action(args: IStatusConfig): Promise<ICommandResult<TFormatterData<'key-value'>>> {
    return {
      success: true,
      data: {
        title: 'status',
        pairs: [{ key: 'verbose', value: String(args.verbose ?? false) }],
      },
    };
  }
}
```

The event bus is injected into every command plugin as `this._events`. A listener is registered with `on(event, listener)`, removed with `off(event, listener)` (or the unsubscribe function `on` returns) and can be registered once with `once(event, listener)`; the listener type is `THookListener<IClappLifecycleMap[event]>`, and the lifecycle map itself can be extended by declaration merging.

## Related packages

| Package                                                                     | Repository                                                                               |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`@clapp/core`](https://www.npmjs.com/package/@clapp/core)                   | [`orion76/clapp-core`](https://github.com/orion76/clapp-core)                             |
| [`@clapp/utils`](https://www.npmjs.com/package/@clapp/utils)                 | [`orion76/clapp-utils`](https://github.com/orion76/clapp-utils)                           |
| [`@clapp/ai-workflow-plugins`](https://www.npmjs.com/package/@clapp/ai-workflow-plugins) | [`orion76/clapp-ai-workflow-plugins`](https://github.com/orion76/clapp-ai-workflow-plugins) |
| [`@clapp/ai-workflow-cli`](https://www.npmjs.com/package/@clapp/ai-workflow-cli) | [`orion76/clapp-ai-workflow-cli`](https://github.com/orion76/clapp-ai-workflow-cli)       |
| [`@clapp/ai-workflow-mcp`](https://www.npmjs.com/package/@clapp/ai-workflow-mcp) | [`orion76/clapp-ai-workflow-mcp`](https://github.com/orion76/clapp-ai-workflow-mcp)       |

## License

MIT

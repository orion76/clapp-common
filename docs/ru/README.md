> ⚠️ **В разработке.** Пакет ещё не готов к релизу: релиз ожидается в ближайшее время, API может меняться. Использовать в продакшне пока нельзя.

[English](../README.md)

# @clapp/common

Общие контракты CLI-фреймворка `clapp`: типы, базовые классы, константы типов плагинов и DI-токены, на которых построены остальные пакеты монорепозитория [`orion76/clapp`](https://github.com/orion76/clapp). Собственной прикладной логики в пакете нет — это словарь, на котором говорят `@clapp/core`, плагины и хосты.

## Возможности

- **Контракты плагинов команд** — `IPluginCommandDefinition`, `IPluginCommand`, `ICommandConfig`, `ICommandResult` и базовый класс `PluginCommandBase`; значения команды собирает `CommandRunner` по `config` её определения.
- **Типы плагинов и виды команд** — константы `PLUGIN_COMMAND_TYPE`, `PLUGIN_COMMAND_ARGUMENT_TYPE`, `PLUGIN_CONTEXT_TYPE`, `PLUGIN_FORMATTER_TYPE` и виды `COMMAND_KIND_TOOL`, `COMMAND_KIND_RESOURCE`, `COMMAND_KIND_PROMPT`, `COMMAND_KIND_GROUP`.
- **Схемы данных команд** — `IPluginCommandDefinition.dataSchema` называет `$id` JSON Schema, которая описывает данные, возвращаемые действием; файлы схем лежат в `schemas/**` своего источника, а секция `ISchemaConfig` конфига приложения связывает `$id` схемы с плагином-форматтером, который её данные рендерит.
- **Контракты данных форматирования** — `ITableData`, `IOrderedListData` и `IKeyValueData`: формы, которые расширяет интерфейс данных команды и которые рендерит `PluginFormatterBase`.
- **Плагины контекстов** — `IContextService`, `IPluginContext` и брендированные идентификаторы `contextToken()`, а также встроенные контексты `cwd`, `app-root`, `user-home`, `process`, `project` и `current-project-path`.
- **Встроенные плагины форматтеров** — два набора типа `formatter`: терминальные форматтеры `table`, `ordered-list`, `key-value` (`src/plugins/formatter/terminal/**`) и их аналоги для MCP (`src/plugins/formatter/mcp/**`), которые хосты находят как пофайловые модули плагинов.
- **Шина событий** — асинхронные хуки жизненного цикла (`IEventBus`, `EventBus`, `IClappLifecycleMap`, `ILifecycle`, `THookListener`) для `command:start`, `command:arguments`, `command:run`, `command:end` и `command:error`.
- **Конфигурация приложения и DI-токены** — `IAppConfig`, `TCliConfigCustom`, `IPluginDiscoveryConfig` с его источниками `appRoot` / `library` / `project`, а также токены `EVENT_BUS_TOKEN`, `COMMAND_MANAGER_TOKEN`, `FORMATTER_MANAGER_TOKEN`, `CONTEXT_SERVICE_TOKEN`.
- **Метаданные приложения** — `initAppMeta()` / `getAppMeta()` с разрешёнными `cwd`, `appPath`, `appRoot` и `userHome` запущенного CLI.

## Установка

Пакет ещё не опубликован в npm, поэтому `npm install @clapp/common` ничего не установит до первого релиза. До этого пакет используется как workspace-пакет монорепозитория:

```bash
npm install @clapp/common
```

## Использование

Плагин команды описывает себя через `@NodePlugin` и реализует контракт через `PluginCommandBase`; результат возвращается как данные, описанные схемой, а не печатается самим плагином:

```ts
import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import {
  COMMAND_KIND_TOOL,
  PLUGIN_COMMAND_TYPE,
  PluginCommandBase,
  type ICommandResult,
  type IKeyValueData,
  type IPluginCommandDefinitionData,
} from '@clapp/common';

interface IStatusConfig {
  verbose?: boolean;
}

/** Данные команды `status`; схема `status` описывает ту же форму. */
interface IStatusData extends IKeyValueData {}

@NodePlugin<IPluginCommandDefinitionData<IStatusConfig>>({
  type: PLUGIN_COMMAND_TYPE,
  kind: COMMAND_KIND_TOOL,
  id: 'status',
  command: 'status',
  label: 'Print the project status',
  dataSchema: 'status',
  config: {
    description: 'Print the project status',
    options: [{ name: 'verbose', description: 'Show every field', type: 'boolean' }],
  },
})
@injectable()
export class StatusCommandPlugin extends PluginCommandBase<IStatusConfig> {
  async action(args: IStatusConfig): Promise<ICommandResult<IStatusData>> {
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

`dataSchema` — это `$id` файла JSON Schema, который лежит в `schemas/**` корня источника, поэтому команде выше соответствует `schemas/status.schema.yml` с `$id: status`. Способ вывода задаёт хост в секции `schemas` своего конфига: `ISchemaConfig.formatters` связывает `status` с id плагина-форматтера (`key-value` терминального набора, например), а `ISchemaConfig.sources` говорит, откуда берутся файлы схем. Ядро валидирует `result.data` по схеме до рендера и отдаёт неуспешный результат с причинами, если данные ей не соответствуют; команда без `dataSchema` по-прежнему печатает вывод сама.

Шина событий внедряется в каждый плагин команды как `this._events`. Обработчик ставится через `on(event, listener)`, снимается через `off(event, listener)` (или через функцию отписки, которую возвращает `on`) и может быть поставлен однократно через `once(event, listener)`; тип обработчика — `THookListener<IClappLifecycleMap[event]>`, а саму карту жизненного цикла можно расширить слиянием объявлений.

## Связанные пакеты

| Пакет                                                                       | Репозиторий                                                                              |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`@clapp/core`](https://www.npmjs.com/package/@clapp/core)                   | [`orion76/clapp-core`](https://github.com/orion76/clapp-core)                             |
| [`@clapp/utils`](https://www.npmjs.com/package/@clapp/utils)                 | [`orion76/clapp-utils`](https://github.com/orion76/clapp-utils)                           |
| [`@clapp/ai-workflow-plugins`](https://www.npmjs.com/package/@clapp/ai-workflow-plugins) | [`orion76/clapp-ai-workflow-plugins`](https://github.com/orion76/clapp-ai-workflow-plugins) |
| [`@clapp/ai-workflow-cli`](https://www.npmjs.com/package/@clapp/ai-workflow-cli) | [`orion76/clapp-ai-workflow-cli`](https://github.com/orion76/clapp-ai-workflow-cli)       |
| [`@clapp/ai-workflow-mcp`](https://www.npmjs.com/package/@clapp/ai-workflow-mcp) | [`orion76/clapp-ai-workflow-mcp`](https://github.com/orion76/clapp-ai-workflow-mcp)       |

## Лицензия

MIT

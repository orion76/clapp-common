# common-refactoring: Перенос классов-типов плагинов и реорганизация barrel-экспортов в @clapp/common: убрать бардак с экспортами, переместить formatter-типы из plugins/command в correct plugin-разделы, пересмотреть barrel экспорты (index.ts, public-api.ts)

**Профиль:** step

## Цель

Перенос классов-типов плагинов и реорганизация barrel-экспортов в @clapp/common: убрать бардак с экспортами, переместить formatter-типы из plugins/command в correct plugin-разделы, пересмотреть barrel экспорты (index.ts, public-api.ts).

## Контекст

В монорепозитории clapp (`packages/*`: common, command, core, utils, ai-workflow-*) наблюдается бардак с экспортами и расстановкой класс-типов:

- Классы-типы formatter зачем-то лежат в `packages/command/` (или его plugin-секции), вместо того чтобы быть в `plugin-types/formatter/` в `@clapp/common`.
- Barrel-экспорты (`index.ts`, `public-api.ts`) в `@clapp/common` и в `packages/command` содержат дубли и несоответствия: одни и те же типы экспортируются из разных мест, некоторые типы потеряны, а некоторые «висят» в не правильном пакете.
- Авторы команд (`ai-workflow-plugins`, `ai-workflow-cli`, `ai-workflow-mcp`) импортируют PluginCommandBase и formatter-типы из `@clapp/command`, контракты — из `@clapp/command` (реэкспорт `@clapp/common`). После переноса все импорты `@clapp/command` должны идти в `@clapp/common`.
- Текущее местонахождение «core-кода плагинов»: `packages/common/src/` (tokens, constants, types/plugin.ts, types/formatter.ts), `packages/command/src/` (formatter/types.ts, plugin.base.ts).

## Требования

1. **Ревью barrel-экспортов**: проверить `packages/common/src/public-api.ts` и `packages/common/src/index.ts` (если есть) — убрать дубли, исправить экспорты так, чтобы formatter-типы (ITableData, IKeyValueData, IFormatterDataMap, UFormatterKind и др.) шли из `@clapp/common`, а не из `@clapp/command`.
2. **Перенос formatter-типов**: найти все файлы с formatter-типами в `packages/command/` (formatter/types.ts, related files) и перенести их в `packages/common/src/plugin-types/formatter/` (или `packages/common/src/plugin-types/formatter/`). Убедиться, что интерфейсы `IPluginFormatter`, `IPluginFormatterDefinition`, данные типы `UFormatterKind`, `TFormatterData`, `IFormatterDataMap`, `IFormatterCommandDefinitionData` теперь экспортируются из `@clapp/common`.
3. **Обновить зависимости**: убрать `@clapp/command` из `peerDependencies`/`dependencies` пакетов `common` и `core`, добавить `@orion76/node-plugin`, `inversify`, `reflect-metadata` в `common` (если еще не добавлено).
4. **Проверить инварианты**: `common` не должен иметь зависимостей от `core` (и от других пакетов clapp); `core` должен зависеть от `common`.
5. **Обновить потребителей**: `ai-workflow-plugins`, `ai-workflow-cli`, `ai-workflow-mcp` должны импортировать formatter-типы из `@clapp/common`, а не из `@clapp/command`.

## Критерии готовности

- Все formatter-типы и классы перемещены в `packages/common/src/plugin-types/formatter/` (или аналогичное расположение в `plugin-types`).
- Barrel-экспорты (`public-api.ts`, `index.ts`) в `@clapp/common` содержат правильные экспорты: formatter-типы из `common`, command-типы перенесены ранее (из задачи plugins-refactoring).
- `@clapp/command` удален (или его剩余 функционал перенесен в common); в коде нет импортов `@clapp/command`, кроме legacy.
- `@clapp/core` реэкспортирует перенесённые сущности без дублирования; внешние импорты не сломаны.
- Порядок сборки пакетов (common → core) сохранён, без циклов импортов.
- У `common` **нет** зависимостей от `core` (и других пакетов clapp); у `core` **есть** зависимость от `common`.

## Вне рамок

- Изменение поведения плагинов, команд, движков, формата `_task.md`/`_todo.yml`.
- Появление зависимости `common` → `core` (или других пакетов clapp) — запрещено.
- Появление новых зависимостей от `@clapp/command` в коде потребителей.
- Документация и тесты — добавляются поэтапно по явному указанию пользователя (в активный релизный `_todo.yml` релиза).
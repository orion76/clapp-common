# common-formatter-plugins: Новый тип плагина formatter и форматтеры вывода для терминала

**Профиль:** small

## Цель

Добавить в `@clapp/common` новый тип плагина — **formatter**: плагин получает данные и возвращает
готовую строку для вывода в терминал. Реализовать два первых плагина-форматтера: `table` (табличные
данные) и `ordered-list` (список с нумерацией или маркерами, пригодный для todo-списка
«заголовок + описание + пункты»). Тип плагина зарегистрировать в ядре (`@clapp/core`) минимально —
чтобы форматтер можно было запросить из кода и увидеть реальный вывод.

## Контекст

- **Целевой проект** — `packages/common` (`@clapp/common`), новый субпроект со своим
  `.opencode/` (как у `packages/core`, `packages/ai`, `packages/command`). Работа ведётся в ветке
  активного релиза `1.0-1`.
- **Плагинная система** — `@orion76/node-plugin@^0.3.0` поверх `inversify` (legacy-декораторы,
  `experimentalDecorators: true`, `emitDecoratorMetadata` **не** используется):
  - плагин — класс с `@NodePlugin({...})` **выше** `@injectable()`;
  - `definition` приходит property-инъекцией из `NodePluginBase`, конкретному плагину собственный
    конструктор не нужен;
  - загрузчик (`PluginLoaderFromFile`) ищет экспорты модулей по glob-паттернам
    `**/*.plugin.{js,ts}` и читает определение, прикреплённое декоратором.
  Примеры для подражания: `packages/command/src/plugin.base.ts` (базовый класс плагина-команды),
  `packages/core/src/context/plugins/app-root.context.ts` (простой не-командный плагин).
- **Текущий состав типов плагинов** (`packages/common/src/constants/plugin-types.ts:1-3`):
  `PLUGIN_COMMAND_TYPE`, `PLUGIN_CONTEXT_TYPE`, `PLUGIN_ARGUMENT_TYPE` (объявлен, не используется).
  Список типов для конфига — `UPluginTypes` в `packages/common/src/types/plugin.ts:4`.
- **Регистрация менеджеров** (`packages/core`):
  - `providePluginManager<P>(type, token, { config }, container)` — `packages/core/src/bootstrap.ts:34-46`;
  - токены менеджеров — `packages/core/src/constants/tokens.ts:14-15`;
  - дефолтный конфиг приложения — `APP_CONFIG_DEFAULT` в `packages/core/src/config/config.ts:5-14`;
  - `ICliConfig.plugins: Record<UPluginTypes, IPluginDiscoveryConfig>` —
    `packages/core/src/types.ts:46-54`; резолв относительных patterns от `appRoot` —
    `packages/core/src/utils/config.ts:48-49`.
- **Библиотека стилей** — `@opentf/cli-styles@^0.15.0` уже добавлена в `dependencies` пакета
  `packages/common/package.json:50` (в коде пока не используется).
- **Правила раскладки модулей** — `.ai/prompts/use-plugin.md`, `.ai/prompts/library.md`; для
  `@clapp/ai` принято `commands/<id>/<id>.plugin.ts` + `types.ts` рядом.
- **Временные файлы** — только `tmp/` в корне репозитория (`/home/pasha/my/clapp/tmp/`), см.
  `AGENTS.md`; `/tmp` не использовать.
- **Сборка common** — `npm run build -w @clapp/common` (rollup, `packages/common/rollup.config.js`):
  `external` — только `peerDependencies` пакета, остальное бандлится через `nodeResolve`.
- Профиль `small`: документация, тесты и ревью в задачу не входят; пункты `г1`/`г2` добавлены
  **сверх профиля** по требованию «нужен проверяемый результат для оценки».

## Требования

1. **Тип плагина в `@clapp/common`:**
   - добавить `PLUGIN_FORMATTER_TYPE = 'PLUGIN_FORMATTER'` в
     `packages/common/src/constants/plugin-types.ts` и включить его в `UPluginTypes`
     (`packages/common/src/types/plugin.ts`);
   - описать контракт в отдельном модуле типов (например `packages/common/src/types/formatter.ts`,
     экспорт из `types/index.ts`), по образцу `IPluginContextDefinition`/`IPluginCommandDefinition`:
     - `IPluginFormatterDefinition extends IPluginDefinition` — минимум поле вида форматтера
       (`kind`, например `'table' | 'ordered-list'` как `string`-расширяемое значение);
     - `IPluginFormatter<D = unknown> extends IPlugin` — `definition` и метод
       `format(data: D): string` (или `Promise<string>`), то есть «данные → строка для терминала».
   - добавить базовый класс `PluginFormatterBase` (по образцу `PluginCommandBase` в
     `packages/command/src/plugin.base.ts`) и экспортировать его, типы и константу из
     `packages/common/src/public-api.ts`.
2. **Два плагина-форматтера** в `packages/common/src/formatters/<kind>/<kind>.plugin.ts`
   (соседние `types.ts` — по правилам раскладки):
   - `table` — принимает заголовки колонок и строки (массив массивов или массив объектов),
     возвращает выровненную по колонкам таблицу;
   - `ordered-list` — принимает заголовок, необязательное описание и массив пунктов,
     возвращает список с нумерацией или маркерами (маркер и нумерация — по опции данных).
   - Оба используют `@opentf/cli-styles` (например, жирный/цветной заголовок, окраска пунктов);
     формат вывода — обычная строка (без ANSI-мусора при пустых данных: пустой вход → осмысленный
     результат, без исключения).
   - Плагины — тонкие: логика форматирования в соседнем модуле (например `lib.ts`), плагин лишь
     отдаёт `definition` и вызывает логику.
3. **Регистрация типа в `@clapp/core` (минимум):**
   - токен менеджера (`FORMATTER_MANAGER_TOKEN`) в `packages/core/src/constants/tokens.ts` и его
     экспорт из публичного API ядра;
   - `PLUGIN_FORMATTER_TYPE: { patterns: [] }` в `APP_CONFIG_DEFAULT.plugins`
     (`packages/core/src/config/config.ts`) — так `ICliConfig.plugins` остаётся полным по `UPluginTypes`;
   - `providePluginManager<IPluginFormatter>(PLUGIN_FORMATTER_TYPE, FORMATTER_MANAGER_TOKEN, ...)`
     в `bootstrapApp` (`packages/core/src/bootstrap.ts`).
   - Конфиг хоста (`clapp.config.yml`) при этом не обязателен: демо-проверка передаёт patterns
     через in-memory конфиг (`IInitAppOptions.config`).
4. **Проверяемый результат (`tmp/`, сверх профиля):** демо-скрипт в `tmp/` корня репозитория,
   который поднимает приложение (`bootstrapApp` с in-memory конфигом, patterns на
   `packages/common/src/formatters/**/*.plugin.ts`), получает `FORMATTER_MANAGER_TOKEN`, достаёт
   оба форматтера по id (`table`, `ordered-list`), передаёт демо-данные todo-списка и печатает
   результат в терминал. Ожидание: вывод читается как настоящий todo-список и как ровная таблица,
   запуск — exit 0.
5. **Сборка common (сверх профиля):** `npm run build -w @clapp/common` проходит. Если
   `@opentf/cli-styles` тянет свой рантайм в бандл и ломает сборку — добавить его в `external`
   `packages/common/rollup.config.js` (по аналогии с `peerDependencies`) и одной строкой зафиксировать
   это решение в `_reports.yml`.

## Критерии готовности

- В `@clapp/common` есть константа типа `PLUGIN_FORMATTER_TYPE`, контракт
  `IPluginFormatterDefinition`/`IPluginFormatter`, базовый класс и два плагина-форматтера
  (`table`, `ordered-list`), экспортированные через `public-api.ts`.
- `npx tsx tmp/formatter-demo.ts` (или эквивалент, зафиксированный в отчёте) — exit 0; в выводе
  видны оформленный заголовок и пункты todo-списка, а также выровненная таблица.
- `npm run build -w @clapp/common` — зелёный.
- `packages/core` регистрирует тип: `FORMATTER_MANAGER_TOKEN` доступен, `PLUGIN_FORMATTER` есть в
  `APP_CONFIG_DEFAULT.plugins`, менеджер создаётся в `bootstrapApp`.
- Правки не затрагивают поведение существующих команд и контекстов (patterns контекстов/команд в
  дефолтном конфиге остались пустыми).

## Вне рамок

- Прочие форматтеры (json, tree, box, diff, progress и т. п.) и составной/вложенный вывод.
- Перевод существующего вывода команд `@clapp/ai` (например `TInfoFormatter` в
  `packages/ai/src/lib/npm/info.ts`) на новый тип плагина.
- Документация (`README`, `AGENTS.md`, `.ai/prompts/use-plugin.md`) и юнит-тесты — профиль `small`
  (добавить отдельной задачей/в релиз, если потребуется).
- Автоматический подбор ширины терминала, темы/палитры, локализация, вывод в stderr.
- Версии, changesets, changelog и публикация пакетов.
- Правки в репозитории `/home/pasha/my/@orion76`.

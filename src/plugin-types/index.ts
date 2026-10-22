/**
 * Плагинный «core-код» плагинов, собранный в `@clapp/common`:
 * контракты и базовые классы типов плагинов (`command/`, `context/`,
 * `formatter/`), общие константы типов/видов и plugin-manager токены.
 * All names re-exported here are available from `common/src/plugin-types/`.
 */
export * from './command/plugin';
export * from './command/base';
export * from './command/formatter';
export * from './context/context';
export * from './context/base';
export * from './formatter/formatter';
export * from './formatter/base';
export * from './constants';
export * from './tokens';

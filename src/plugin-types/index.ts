/**
 * Плагинный «core-код» плагинов, собранный в `@clapp/common`:
 * контракты и базовые классы типов плагинов (`command/`, `context/`,
 * `formatter/`), общие константы типов/видов и plugin-manager токены.
 * All names re-exported here are available from `common/src/plugin-types/`.
 */
export * from './types';
export * from './formatter';
export * from './command';
export * from './command-argument';
export * from './context';

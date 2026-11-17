import { IPluginManager } from '@orion76/plugin';
import { ServiceIdentifier } from 'inversify';
import { IContextService, IPluginContext } from './types';


/**
 * Injection token of the command plugin manager registered by `Clapp`.
 */

export const CONTEXT_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginContext>> = Symbol('CONTEXT_MANAGER');
export const CONTEXT_SERVICE_TOKEN: ServiceIdentifier<IContextService> = Symbol('CONTEXT_SERVICE');


// 1. Объявляем уникальный символ для защиты от структурной типизации
declare const __brand: unique symbol;

// 2. Создаем тип брендированной строки, который также хранит тип зависимости (T)
export type Token<T> = string & {
  readonly [__brand]: T;
};

// 3. Хелпер для удобного создания токенов
export function createToken<T>(name: string): Token<T> {
  return name as Token<T>;
}
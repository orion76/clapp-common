import type { IPluginManager } from '@orion76/node-plugin';
import type { ServiceIdentifier } from 'inversify';

import type { IPluginCommand } from './command/plugin';
import type { IPluginContext } from './context/context';
import type { IPluginFormatter } from './formatter/formatter';

/**
 * Injection token of the shared asynchronous event bus registered by `Clapp`.
 */
export const EVENT_BUS_TOKEN = Symbol('clapp.event.bus');

/**
 * Injection token of the command plugin manager registered by `Clapp`.
 */
export const COMMAND_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginCommand>> = Symbol('COMMAND_MANAGER');

/**
 * Injection token of the context plugin manager registered by `Clapp`.
 */
export const CONTEXT_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginContext>> = Symbol('CONTEXT_MANAGER_');

/**
 * Injection token of the formatter plugin manager registered by `Clapp`.
 */
export const FORMATTER_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginFormatter>> = Symbol('FORMATTER_MANAGER');

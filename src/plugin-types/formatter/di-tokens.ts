import { IPluginManager } from '@orion76/plugin';
import { ServiceIdentifier } from 'inversify';
import { IPluginFormatter } from './types/plugin';


/**
 * Injection token of the formatter plugin manager registered by `Clapp`.
 */
export const FORMATTER_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginFormatter>> = Symbol('FORMATTER_MANAGER');

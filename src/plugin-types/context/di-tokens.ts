import { IPluginManager } from '@orion76/plugin';
import { ServiceIdentifier } from 'inversify';
import { IContextService, IPluginContext } from './types';


/**
 * Injection token of the command plugin manager registered by `Clapp`.
 */

export const CONTEXT_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginContext>> = Symbol('CONTEXT_MANAGER');
export const CONTEXT_SERVICE_TOKEN: ServiceIdentifier<IContextService> = Symbol('CONTEXT_SERVICE');
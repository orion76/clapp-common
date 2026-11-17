import type { IPluginManager } from '@orion76/plugin';
import type { ServiceIdentifier } from 'inversify';

import type { IPluginContext } from './types';

/**
 * Injection token of the context plugin manager registered by the host.
 */
export const CONTEXT_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginContext>> = Symbol('CONTEXT_MANAGER');

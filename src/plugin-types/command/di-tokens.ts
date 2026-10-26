import { IPluginManager } from '@orion76/plugin';
import { ServiceIdentifier } from 'inversify';

import { ICommandService, IPluginCommand } from './types';

export const COMMAND_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginCommand>> = Symbol('COMMAND_MANAGER');
export const COMMAND_SERVICE_TOKEN: ServiceIdentifier<ICommandService> = Symbol('COMMAND_SERVICE');

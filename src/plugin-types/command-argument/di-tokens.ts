import { IPluginManager } from '@orion76/plugin';
import { ServiceIdentifier } from 'inversify';
import { IPluginCommandArgument } from './types';

export const COMMAND_ARGUMENT_MANAGER_TOKEN: ServiceIdentifier<IPluginManager<IPluginCommandArgument>> =
  Symbol('COMMAND_ARGUMENT_MANAGERu');

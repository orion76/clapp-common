import process from 'node:process';

import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type TContextIdentifier,
} from '../../../plugin-types/context';

/** Token of the `process` context. Value: the current Node.js process. */
export const PROCESS: TContextIdentifier<NodeJS.Process> = contextToken<NodeJS.Process>('process');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: PROCESS,
  label: 'App process',
})
@injectable()
export class ProcessContext extends PluginContextBase<NodeJS.Process> {
  async getContext(): Promise<NodeJS.Process> {
    return process;
  }
}

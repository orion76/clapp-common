import process from 'node:process';

import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase } from '@clapp/common';

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'process',
  label: 'App process',
})
export class ProcessContext extends PluginContextBase<NodeJS.Process> {
  async getContext(): Promise<NodeJS.Process> {
    return process;
  }
}

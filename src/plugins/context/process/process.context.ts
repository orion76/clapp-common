import process from 'node:process';

import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase, type IPluginContextDefinition } from '@clapp/common';

const definition = {
  type: PLUGIN_CONTEXT_TYPE,
  id: 'process',
  label: 'App process',
} as const satisfies IPluginContextDefinition;

@NodePlugin(definition)
export class ProcessContext extends PluginContextBase<NodeJS.Process> {
  async getContext(): Promise<NodeJS.Process> {
    return process;
  }
}

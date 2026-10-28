import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase, type IPluginContextDefinition } from '@clapp/common';
import { getAppMeta } from '../app-meta';

const definition = {
  type: PLUGIN_CONTEXT_TYPE,
  id: 'user-home',
  label: 'App user home directory',
} as const satisfies IPluginContextDefinition;

@NodePlugin(definition)
export class UserHomeContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    return getAppMeta().userHome;
  }
}

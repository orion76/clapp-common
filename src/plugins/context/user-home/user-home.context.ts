import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase } from '@clapp/common';
import { getAppMeta } from '../app-meta';

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'user-home',
  label: 'App user home directory',
})
export class UserHomeContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    return getAppMeta().userHome;
  }
}

import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase } from '@clapp/common';
import { getAppMeta } from '../app-meta';

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'cwd',
  label: 'App CWD',
})
export class CwdContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    return getAppMeta().cwd;
  }
}

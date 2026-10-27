import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase, type IPluginContext, type IPluginContextDefinition } from '@clapp/common';
import { getAppMeta } from '../app-meta';

@NodePlugin<IPluginContextDefinition>({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'cwd',
  label: 'App CWD',
})
export class CwdContext extends PluginContextBase<string> implements IPluginContext<string> {
  async getContext(ddd:string): Promise<string> {
    return getAppMeta().cwd;
  }
}

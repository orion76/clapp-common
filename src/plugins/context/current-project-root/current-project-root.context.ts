import { NodePlugin } from '@orion76/node-plugin';

import { CWD, PLUGIN_CONTEXT_TYPE, PluginContextBase, USER_HOME } from '@clapp/common';
import { getProjectRoot } from '@clapp/utils';


@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'current-project-path',
  label: 'Current project path',
})
export class CurrentProjectContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    const cwd = await this._context.get(CWD);
    const userHome = await this._context.get(USER_HOME);
    const currentProjectRoot = getProjectRoot(cwd, userHome);
    if (currentProjectRoot === undefined) {
      throw new Error(`Project root not found. cwd:${cwd}, userHome:${userHome}`);
    }
    return currentProjectRoot;
  }
}

import { NodePlugin } from '@orion76/node-plugin';

import { CWD, PLUGIN_CONTEXT_TYPE, PluginContextBase, USER_HOME } from '@clapp/common';
import { getProjectRoot } from '@clapp/utils';

const CONTEXT_TOKEN_APP_ROOT = Symbol('app-root')

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'app-root',
  label: 'App root directory',
})
export class AppRootContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    const appPath = await this._context.get(CWD);
    const userHome = await this._context.get(USER_HOME);

    const appRoot = getProjectRoot(appPath, userHome);
    if (!appRoot) {
      throw new Error(`error receiving the appRoot`);
    }
    return appRoot;
  }
}

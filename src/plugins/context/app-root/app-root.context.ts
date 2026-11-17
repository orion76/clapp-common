import { NodePlugin } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';

import { getProjectRoot } from '@clapp/utils';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type IPluginContextDefinition,
  type TContextIdentifier,
} from '../../../plugin-types/context';
import { CWD } from '../cwd/cwd.context';
import { USER_HOME } from '../user-home/user-home.context';

/** Token of the `app-root` context. Value: absolute path of the app root. */
export const APP_ROOT: TContextIdentifier<string> = contextToken<string>('app-root');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: APP_ROOT,
  label: 'App root directory',
} as const satisfies IPluginContextDefinition<string>)
@injectable()
export class AppRootContext extends PluginContextBase<string> {
  @inject(CWD) private readonly cwd!: string;
  @inject(USER_HOME) private readonly userHome!: string;

  async getContext(): Promise<string> {
    const appRoot = getProjectRoot(this.cwd, this.userHome);

    if (!appRoot) {
      throw new Error(`error receiving the appRoot`);
    }

    return appRoot;
  }
}

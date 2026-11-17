import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type TContextIdentifier,
} from '../../../plugin-types/context';
import { getAppMeta } from '../app-meta';

/** Token of the `user-home` context. Value: user home directory. */
export const USER_HOME: TContextIdentifier<string> = contextToken<string>('user-home');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: USER_HOME,
  label: 'App user home directory',
})
@injectable()
export class UserHomeContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    return getAppMeta().userHome;
  }
}

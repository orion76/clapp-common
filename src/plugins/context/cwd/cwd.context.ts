import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type TContextIdentifier,
} from '../../../plugin-types/context';
import { getAppMeta } from '../app-meta';

/** Token of the `cwd` context. Value: current working directory. */
export const CWD: TContextIdentifier<string> = contextToken<string>('cwd');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: CWD,
  label: 'App CWD',
})
@injectable()
export class CwdContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    return getAppMeta().cwd;
  }
}

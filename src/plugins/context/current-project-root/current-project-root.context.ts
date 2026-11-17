import { NodePlugin } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';

import { getProjectRoot } from '@clapp/utils';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type TContextIdentifier,
} from '../../../plugin-types/context';
import { CWD } from '../cwd/cwd.context';
import { USER_HOME } from '../user-home/user-home.context';

/** Token of the `current-project-path` context. Value: absolute project root. */
export const CURRENT_PROJECT_PATH: TContextIdentifier<string> = contextToken<string>('current-project-path');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: CURRENT_PROJECT_PATH,
  label: 'Current project path',
})
@injectable()
export class CurrentProjectContext extends PluginContextBase<string> {
  @inject(CWD) private readonly cwd!: string;
  @inject(USER_HOME) private readonly userHome!: string;

  async getContext(): Promise<string> {
    const currentProjectRoot = getProjectRoot(this.cwd, this.userHome);

    if (currentProjectRoot === undefined) {
      throw new Error(`Project root not found. cwd:${this.cwd}, userHome:${this.userHome}`);
    }

    return currentProjectRoot;
  }
}

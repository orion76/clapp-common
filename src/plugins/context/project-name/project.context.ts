import { NodePlugin } from '@orion76/node-plugin';
import { inject, injectable } from 'inversify';

import {
  contextToken,
  PLUGIN_CONTEXT_TYPE,
  PluginContextBase,
  type IPluginContextDefinition,
  type TContextIdentifier,
} from '../../../plugin-types/context';
import { APP_ROOT } from '../app-root/app-root.context';
import { readProjectName } from './lib';

/** Token of the `project` context. Value: name of the context project. */
export const PROJECT_PATH: TContextIdentifier<string> = contextToken<string>('project');

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: PROJECT_PATH,
  label: 'Context project name',
} as const satisfies IPluginContextDefinition<string>)
@injectable()
export class ProjectContext extends PluginContextBase<string> {
  @inject(APP_ROOT) private readonly appRoot!: string;

  async getContext(): Promise<string> {
    return readProjectName(this.appRoot);
  }
}

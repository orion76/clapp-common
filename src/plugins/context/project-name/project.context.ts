import { NodePlugin } from '@orion76/node-plugin';
import { APP_ROOT, PLUGIN_CONTEXT_TYPE, PluginContextBase, type IPluginContextDefinition } from '@clapp/common';
import { readProjectName } from './lib';

@NodePlugin({
  type: PLUGIN_CONTEXT_TYPE,
  id: 'project',
  label: 'Context project name',
} as const satisfies IPluginContextDefinition)
export class ProjectContext extends PluginContextBase<string> {
  async getContext(): Promise<string> {
    const projectRoot = await this._context.get(APP_ROOT)

    if (projectRoot === null) {
      return '';
    }

    return readProjectName(projectRoot);
  }
}

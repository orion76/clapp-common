import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE, PluginContextBase, CWD, USER_HOME, type IPluginContextDefinition } from '@clapp/common';
import { getProjectRoot } from '@clapp/utils';
import { getAppMeta } from '../app-meta';

const definition = {
  type: PLUGIN_CONTEXT_TYPE,
  id: 'current-project-path',
  label: 'Current project path',
  dependencies: [CWD, USER_HOME],
} as const satisfies IPluginContextDefinition;

@NodePlugin(definition)
export class CurrentProjectContext extends PluginContextBase<string, typeof definition.dependencies> {
  async getContext(cwd: string, userHome: string): Promise<string> {
    const currentProjectRoot = getProjectRoot(cwd, userHome);
    if (currentProjectRoot === undefined) {
      throw new Error(`Project root not found. cwd:${cwd}, userHome:${userHome}`);
    }
    return currentProjectRoot;
  }
}

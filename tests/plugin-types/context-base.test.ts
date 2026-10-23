import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { Container, injectable } from 'inversify';
import { NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';

import { PluginContextBase } from '../../src/plugin-types/context/base.js';
import type { IPluginContextDefinition } from '../../src/plugin-types/context/types.js';
import { PLUGIN_CONTEXT_TYPE } from '../../src/plugin-types/constants.js';

const definition: IPluginContextDefinition = {
  type: PLUGIN_CONTEXT_TYPE,
  id: 'test-context',
  label: 'Test Context',
};

@NodePlugin(definition)
@injectable()
class TestContext extends PluginContextBase<{ cwd: string }, [string]> {
  getContext(dir: string): Promise<{ cwd: string }> {
    return Promise.resolve({ cwd: dir });
  }
}

function createContext(): TestContext {
  const container = new Container();
  container.bind(PLUGIN_DEFINITION).toConstantValue(definition);
  container.bind(TestContext).toSelf();
  return container.get(TestContext);
}

describe('PluginContextBase', () => {
  it('injects a definition and exposes id/label/type', () => {
    const context = createContext();
    expect(context.definition).toMatchObject({ id: 'test-context', label: 'Test Context', type: 'PLUGIN_CONTEXT' });
    expect(context.id).toBe('test-context');
    expect(context.label).toBe('Test Context');
    expect(context.type).toBe('PLUGIN_CONTEXT');
  });

  it('runs the concrete getContext implementation', async () => {
    const context = createContext();
    await expect(context.getContext('/work')).resolves.toEqual({ cwd: '/work' });
  });
});

import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';
import { Container, injectable } from 'inversify';

import { PluginContextBase } from '../../src/plugin-types/context/base.js';
import { PLUGIN_CONTEXT_TYPE } from '../../src/plugin-types/context/constants.js';
import type { IPluginContextDefinition } from '../../src/plugin-types/context/types.js';

const definition: IPluginContextDefinition = {
  type: PLUGIN_CONTEXT_TYPE,
  id: 'test-context',
  label: 'Test Context',
};

interface IArguments {
  cwd: string;
}

@NodePlugin(definition)
@injectable()
class TestContext extends PluginContextBase<IArguments> {
  async getContext(dir: string): Promise<IArguments> {
    return { cwd: dir };
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

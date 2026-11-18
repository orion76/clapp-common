import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { getPluginDefinition, NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';
import { Container, injectable } from 'inversify';

import { PluginContextBase } from '../../src/plugin-types/context/base.js';
import { PLUGIN_CONTEXT_TYPE } from '../../src/plugin-types/context/constants.js';
import { contextToken } from '../../src/plugin-types/context/types.js';
import type { IPluginContextDefinition, TContextIdentifier } from '../../src/plugin-types/context/types.js';

interface IContextValue {
  cwd: string;
}

const TEST_CONTEXT: TContextIdentifier<IContextValue> = contextToken<IContextValue>('test-context');

const definition: IPluginContextDefinition<IContextValue> = {
  type: PLUGIN_CONTEXT_TYPE,
  id: TEST_CONTEXT,
  label: 'Test Context',
};

@NodePlugin(definition)
@injectable()
class TestContext extends PluginContextBase<IContextValue> {
  async getContext(): Promise<IContextValue> {
    return { cwd: '/work' };
  }
}

// A context declares no injected dependency of its own: the definition binding is the
// only thing the base class needs from the container.
function createContext(): TestContext {
  const container = new Container();
  container.bind(PLUGIN_DEFINITION).toConstantValue(definition);
  container.bind(TestContext).toSelf();
  return container.get(TestContext);
}

describe('PluginContextBase', () => {
  it('injects a definition and exposes id/label/type', () => {
    const context = createContext();
    expect(context.definition).toMatchObject({
      id: 'test-context',
      label: 'Test Context',
      type: PLUGIN_CONTEXT_TYPE,
    });
    expect(context.id).toBe('test-context');
    expect(context.label).toBe('Test Context');
    expect(context.type).toBe(PLUGIN_CONTEXT_TYPE);
  });

  it('runs the concrete getContext implementation', async () => {
    const context = createContext();
    await expect(context.getContext()).resolves.toEqual({ cwd: '/work' });
  });

  it('resolves without a context service binding', () => {
    // The base class property-injects only the definition: a container with that single
    // binding resolves the plugin, there is no `_context`/context service to satisfy.
    const context = createContext();

    expect(context).toBeInstanceOf(PluginContextBase);
    expect(context.definition.id).toBe(TEST_CONTEXT);
  });

  it('keeps the context token as the id of the decorated plugin', () => {
    expect(getPluginDefinition(TestContext)?.id).toBe(TEST_CONTEXT);
    // The runtime value of the token is the plain plugin id, so discovery sees a string.
    expect(TEST_CONTEXT).toBe('test-context');
  });
});

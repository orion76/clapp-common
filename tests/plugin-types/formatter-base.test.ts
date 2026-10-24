import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { Container, injectable } from 'inversify';
import { NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';

import { PluginFormatterBase } from '../../src/plugin-types/formatter/base.js';
import type { IPluginFormatterDefinition } from '../../src/plugin-types/formatter/types/plugin.js';
import { PLUGIN_FORMATTER_TYPE } from '../../src/plugin-types/constants.js';

const definition: IPluginFormatterDefinition<'table'> = {
  type: PLUGIN_FORMATTER_TYPE,
  id: 'test-formatter',
  label: 'Test Formatter',
  kind: 'table',
};

@NodePlugin(definition)
@injectable()
class TestFormatter extends PluginFormatterBase<{ key: string }> {
  async format(data: { key: string }): Promise<string> {
    return `${data.key}=v`;
  }
}

function createFormatter(): TestFormatter {
  const container = new Container();
  container.bind(PLUGIN_DEFINITION).toConstantValue(definition);
  container.bind(TestFormatter).toSelf();
  return container.get(TestFormatter);
}

describe('PluginFormatterBase', () => {
  it('injects a definition and exposes id/label/type', () => {
    const formatter = createFormatter();
    expect(formatter.definition).toMatchObject({ id: 'test-formatter', label: 'Test Formatter', type: 'PLUGIN_FORMATTER' });
    expect(formatter.id).toBe('test-formatter');
    expect(formatter.label).toBe('Test Formatter');
    expect(formatter.type).toBe('PLUGIN_FORMATTER');
  });

  it('runs the concrete format implementation', async () => {
    const formatter = createFormatter();
    await expect(formatter.format({ key: 'value' })).resolves.toBe('value=v');
  });
});

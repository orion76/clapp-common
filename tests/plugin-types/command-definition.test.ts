import { describe, expect, it } from '@jest/globals';

import { COMMAND_KIND_RESOURCE, PLUGIN_COMMAND_TYPE } from '../../src/plugin-types/command/constants.js';
import type { IPluginCommandDefinitionData } from '../../src/plugin-types/command/types.js';
import { PLUGIN_FORMATTER_TYPE } from '../../src/plugin-types/formatter/constants.js';
import type { IPluginFormatterDefinition } from '../../src/plugin-types/formatter/types/plugin.js';

/**
 * Definition without the data field under test, so every case differs from the base only
 * in the field the contract is about.
 */
const COMMAND_BASE: Omit<IPluginCommandDefinitionData, 'dataSchema'> = {
  type: PLUGIN_COMMAND_TYPE,
  id: 'task_list',
  label: 'List tasks',
  command: 'list',
  kind: COMMAND_KIND_RESOURCE,
  config: {},
};

describe('command definition data contract', () => {
  it('names the data shape with dataSchema', () => {
    const definition: IPluginCommandDefinitionData = { ...COMMAND_BASE, dataSchema: 'task-list' };

    expect(definition.dataSchema).toBe('task-list');
  });

  it('does not accept the removed formatter field', () => {
    // @ts-expect-error `formatter` was replaced by `dataSchema`: the app config maps a schema to a formatter
    const definition: IPluginCommandDefinitionData = { ...COMMAND_BASE, formatter: 'table' };

    expect(definition.dataSchema).toBeUndefined();
  });

  it('treats dataSchema as optional, because a command may print its own output', () => {
    const definition: IPluginCommandDefinitionData = { ...COMMAND_BASE };

    expect(definition.dataSchema).toBeUndefined();
  });
});

describe('formatter definition contract', () => {
  it('declares base plugin fields only', () => {
    const definition: IPluginFormatterDefinition = {
      type: PLUGIN_FORMATTER_TYPE,
      id: 'table',
      label: 'Table',
    };

    expect(definition.id).toBe('table');
  });

  it('does not accept the removed kind field', () => {
    const definition: IPluginFormatterDefinition = {
      type: PLUGIN_FORMATTER_TYPE,
      id: 'table',
      label: 'Table',
      // @ts-expect-error a formatter no longer declares a kind: the schema map decides which data it renders
      kind: 'table',
    };

    expect(definition.type).toBe(PLUGIN_FORMATTER_TYPE);
  });
});

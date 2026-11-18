import { beforeEach, describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';
import { Container, injectable } from 'inversify';

import { PluginCommandBase } from '../../src/plugin-types/command/base.js';
import { PLUGIN_COMMAND_TYPE } from '../../src/plugin-types/command/constants.js';
import type { ICommandResult, IPluginCommandDefinitionData } from '../../src/plugin-types/command/types.js';
import { EVENT_BUS_TOKEN } from '../../src/tokens.js';
import type { IClappLifecycleMap, IEventBus } from '../../src/types/events.js';

const definition: IPluginCommandDefinitionData = {
  type: PLUGIN_COMMAND_TYPE,
  id: 'read_file',
  label: 'Read a file',
  command: 'read',
  kind: 'tool',
  config: {
    arguments: [
      { name: 'path', description: 'File path' },
      { name: 'encoding', description: 'Text encoding' },
    ],
  },
};

// PluginCommandBase declares the shared event bus as an injected property; the test
// binds a recording stub so the container can resolve the class without a runtime and
// the test can observe what the command emitted.
const emitted: string[] = [];

const RECORDING_BUS: IEventBus<IClappLifecycleMap> = {
  hook: async (event) => {
    emitted.push(event);
    return undefined;
  },
  on: () => () => { },
  once: () => () => { },
  off: () => { },
};

@NodePlugin(definition)
@injectable()
class ReadFileCommand extends PluginCommandBase<{ path: string; encoding: string }, {}> {
  async action(args: { path: string; encoding: string }): Promise<ICommandResult> {
    return { success: true, data: args.path };
  }

  // Exposes the injected bus through the protected field so the test sees the injection.
  async announce(): Promise<void> {
    await this._events.hook('command:start', { id: this.id, type: this.type, data: { args: [], opts: {} } });
  }
}

function createCommand(): ReadFileCommand {
  const container = new Container();
  container.bind(PLUGIN_DEFINITION).toConstantValue(definition);
  container.bind(EVENT_BUS_TOKEN).toConstantValue(RECORDING_BUS);
  container.bind(ReadFileCommand).toSelf();
  return container.get(ReadFileCommand);
}

describe('PluginCommandBase', () => {
  beforeEach(() => {
    emitted.length = 0;
  });

  it('injects a definition and exposes id/label/type', () => {
    const command = createCommand();
    expect(command.definition).toMatchObject({
      id: 'read_file',
      label: 'Read a file',
      command: 'read',
      kind: 'tool',
      type: PLUGIN_COMMAND_TYPE,
    });
    expect(command.id).toBe('read_file');
    expect(command.label).toBe('Read a file');
    expect(command.type).toBe(PLUGIN_COMMAND_TYPE);
  });

  it('maps positional operands to named arguments from the definition', async () => {
    const command = createCommand();
    await expect(command.getArguments(['/a.txt', 'utf-8'], {})).resolves.toEqual({
      path: '/a.txt',
      encoding: 'utf-8',
    });
  });

  it('injects the shared event bus and emits through it', async () => {
    const command = createCommand();

    await command.announce();

    expect(emitted).toEqual(['command:start']);
  });
});

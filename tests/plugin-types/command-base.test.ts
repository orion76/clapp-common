import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { Container, injectable } from 'inversify';
import { NodePlugin, PLUGIN_DEFINITION } from '@orion76/node-plugin';

import { PluginCommandBase } from '../../src/plugin-types/command/base.js';
import type { ICommandResult, IPluginCommandDefinitionData } from '../../src/plugin-types/command/types.js';
import { PLUGIN_COMMAND_TYPE } from '../../src/plugin-types/constants.js';
import { EVENT_BUS_TOKEN } from '../../src/tokens.js';
import type { IClappLifecycleMap, IEventBus } from '../../src/types/events.js';

const definition: IPluginCommandDefinitionData = {
  type: PLUGIN_COMMAND_TYPE,
  id: 'read_file',
  label: 'Read a file',
  command: 'read',
  kind: 'tool',
  config: { arguments: [{ name: 'path', description: 'File path' }, { name: 'encoding', description: 'Text encoding' }] },
};

// PluginCommandBase declares the shared event bus as an injected property; the
// test binds a stub so the container can resolve the class without a runtime.
const EMPTY_BUS: IEventBus<IClappLifecycleMap> = {
  hook: async () => undefined,
  on: () => () => {},
  once: () => () => {},
  off: () => {},
};

@NodePlugin(definition)
@injectable()
class ReadFileCommand extends PluginCommandBase<{ path: string; encoding: string }, []> {
  action(args: { path: string; encoding: string }, contexts: []): Promise<ICommandResult> {
    return Promise.resolve({ success: true, data: args.path });
  }
}

function createCommand(): ReadFileCommand {
  const container = new Container();
  container.bind(PLUGIN_DEFINITION).toConstantValue(definition);
  container.bind(EVENT_BUS_TOKEN).toConstantValue(EMPTY_BUS);
  container.bind(ReadFileCommand).toSelf();
  return container.get(ReadFileCommand);
}

describe('PluginCommandBase', () => {
  it('injects a definition and exposes id/label/type', () => {
    const command = createCommand();
    expect(command.definition).toMatchObject({
      id: 'read_file',
      label: 'Read a file',
      command: 'read',
      kind: 'tool',
      type: 'PLUGIN_COMMAND',
    });
    expect(command.id).toBe('read_file');
    expect(command.label).toBe('Read a file');
    expect(command.type).toBe('PLUGIN_COMMAND');
  });

  it('maps positional operands to named arguments from the definition', async () => {
    const command = createCommand();
    await expect(command.getArguments(['/a.txt', 'utf-8'], {})).resolves.toEqual({
      path: '/a.txt',
      encoding: 'utf-8',
    });
  });
});

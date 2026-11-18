import { describe, expect, it } from '@jest/globals';
import { COMMAND_KIND_GROUP, COMMAND_KIND_PROMPT, COMMAND_KIND_RESOURCE, COMMAND_KIND_TOOL, PLUGIN_COMMAND_ARGUMENT_TYPE, PLUGIN_COMMAND_TYPE, PLUGIN_CONTEXT_TYPE, PLUGIN_FORMATTER_TYPE } from '../../src';



describe('plugin type constants', () => {
  it('defines the command plugin type', () => {
    expect(PLUGIN_COMMAND_TYPE).toBe('command');
  });

  it('defines the context plugin type', () => {
    expect(PLUGIN_CONTEXT_TYPE).toBe('context');
  });

  it('defines the argument plugin type', () => {
    expect(PLUGIN_COMMAND_ARGUMENT_TYPE).toBe('command-argument');
  });

  it('defines the formatter plugin type', () => {
    expect(PLUGIN_FORMATTER_TYPE).toBe('formatter');
  });

  it('keeps all plugin type constants distinct', () => {
    const types = [PLUGIN_COMMAND_TYPE, PLUGIN_CONTEXT_TYPE, PLUGIN_COMMAND_ARGUMENT_TYPE, PLUGIN_FORMATTER_TYPE];
    expect(new Set(types).size).toBe(types.length);
  });
});

describe('command kind constants', () => {
  it('defines the resource kind', () => {
    expect(COMMAND_KIND_RESOURCE).toBe('resource');
  });

  it('defines the tool kind', () => {
    expect(COMMAND_KIND_TOOL).toBe('tool');
  });

  it('defines the prompt kind', () => {
    expect(COMMAND_KIND_PROMPT).toBe('prompt');
  });

  it('defines the group kind', () => {
    expect(COMMAND_KIND_GROUP).toBe('group');
  });

  it('keeps all command kind constants distinct', () => {
    const kinds = [COMMAND_KIND_RESOURCE, COMMAND_KIND_TOOL, COMMAND_KIND_PROMPT, COMMAND_KIND_GROUP];
    expect(new Set(kinds).size).toBe(kinds.length);
  });
});

import { describe, expect, it } from '@jest/globals';

import {
  COMMAND_MANAGER_TOKEN,
  CONTEXT_MANAGER_TOKEN,
  FORMATTER_MANAGER_TOKEN,
} from '../../src/plugin-types';

describe('plugin-manager tokens', () => {
  it('exports command manager token as a symbol', () => {
    expect(typeof COMMAND_MANAGER_TOKEN).toBe('symbol');
    expect(COMMAND_MANAGER_TOKEN.toString()).toContain('COMMAND_MANAGER');
  });

  it('exports context manager token as a symbol', () => {
    expect(typeof CONTEXT_MANAGER_TOKEN).toBe('symbol');
    expect(CONTEXT_MANAGER_TOKEN.toString()).toContain('CONTEXT_MANAGER');
  });

  it('exports formatter manager token as a symbol', () => {
    expect(typeof FORMATTER_MANAGER_TOKEN).toBe('symbol');
    expect(FORMATTER_MANAGER_TOKEN.toString()).toContain('FORMATTER_MANAGER');
  });

  it('keeps all manager tokens distinct', () => {
    const tokens = [COMMAND_MANAGER_TOKEN, CONTEXT_MANAGER_TOKEN, FORMATTER_MANAGER_TOKEN];
    expect(new Set(tokens).size).toBe(tokens.length);
  });
});

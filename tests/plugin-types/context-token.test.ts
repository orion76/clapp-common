import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

import { getPluginDefinition } from '@orion76/node-plugin';

import { PLUGIN_CONTEXT_TYPE } from '../../src/plugin-types/context/constants.js';
import { contextToken } from '../../src/plugin-types/context/types.js';
import type { IPluginContextDefinition, TContextIdentifier } from '../../src/plugin-types/context/types.js';
import { APP_ROOT, AppRootContext } from '../../src/plugins/context/app-root/app-root.context.js';
import {
  CURRENT_PROJECT_PATH,
  CurrentProjectContext,
} from '../../src/plugins/context/current-project-root/current-project-root.context.js';
import { CWD, CwdContext } from '../../src/plugins/context/cwd/cwd.context.js';
import { PROCESS, ProcessContext } from '../../src/plugins/context/process/process.context.js';
import { PROJECT_PATH, ProjectContext } from '../../src/plugins/context/project-name/project.context.js';
import { USER_HOME, UserHomeContext } from '../../src/plugins/context/user-home/user-home.context.js';

interface IContextTokenCase {
  id: string;
  token: TContextIdentifier<unknown>;
  contextClass: object;
}

const CONTEXT_TOKEN_CASES: IContextTokenCase[] = [
  { id: 'app-root', token: APP_ROOT, contextClass: AppRootContext },
  { id: 'cwd', token: CWD, contextClass: CwdContext },
  { id: 'user-home', token: USER_HOME, contextClass: UserHomeContext },
  { id: 'process', token: PROCESS, contextClass: ProcessContext },
  { id: 'current-project-path', token: CURRENT_PROJECT_PATH, contextClass: CurrentProjectContext },
  { id: 'project', token: PROJECT_PATH, contextClass: ProjectContext },
];

// --- Type-level locks (compiled, never executed) -----------------------------
function typeLocks(): void {
  const textToken: TContextIdentifier<string> = contextToken<string>('text');
  const homeValue: TContextIdentifier<string> = USER_HOME;

  // The token is a plain string at runtime: discovery and `IPluginDefinition.id` see a string.
  const asString: string = PROCESS;

  // @ts-expect-error a plain string carries no value type and is not a token
  const plainString: TContextIdentifier<string> = 'cwd';
  // @ts-expect-error the brand pins the value type: a string token is not a number token
  const numberToken: TContextIdentifier<number> = textToken;
  // @ts-expect-error the process token is branded with NodeJS.Process, not with a string
  const processAsText: TContextIdentifier<string> = PROCESS;

  void homeValue;
  void asString;
  void plainString;
  void numberToken;
  void processAsText;
}

void typeLocks;

describe('contextToken', () => {
  it('returns the id itself as the runtime value', () => {
    const token = contextToken<string>('widget');

    expect(typeof token).toBe('string');
    expect(token).toBe('widget');
    // The brand is a compile-time annotation only: the same id always yields an equal value.
    expect(contextToken<number>('widget')).toBe(token);
  });

  it('serves as the id of a context definition', () => {
    const token: TContextIdentifier<string> = contextToken<string>('widget');
    const contextDefinition: IPluginContextDefinition<string> = {
      type: PLUGIN_CONTEXT_TYPE,
      id: token,
      label: 'Widget',
    };

    expect(contextDefinition.type).toBe(PLUGIN_CONTEXT_TYPE);
    expect(contextDefinition.id).toBe('widget');
  });

  it('binds every context plugin under the token declared in its own module', () => {
    for (const contextCase of CONTEXT_TOKEN_CASES) {
      // Discovery and the bootstrap binding read `definition.id`, the injection reads the
      // token: they must be the same string, otherwise the injected value is never bound.
      expect(getPluginDefinition(contextCase.contextClass)?.id).toBe(contextCase.id);
      expect(contextCase.token).toBe(contextCase.id);
    }
  });

  it('keeps the tokens of different contexts distinct', () => {
    const ids = CONTEXT_TOKEN_CASES.map((contextCase) => contextCase.token);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

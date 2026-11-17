import type { IPluginManager } from '@orion76/plugin';

import { ARGUMENT_REGISTRY, findArgumentByName } from '../../types/argument';
import type { IPluginCommandDefinition } from '../command/types';
import type { IPluginCommandArgument, IPluginCommandArgumentDefinition } from './types';

/**
 * Resolves the command argument chain: instances of the discovered argument plugins
 * in the order the chain runs. Position comes from `order` of the definition (`0` by
 * default), ties are broken by `id`, so the result never depends on the discovery glob
 * order. An empty chain is a normal state and fills nothing.
 * @param manager Manager of the command argument plugins
 * @returns Instances of the discovered argument plugins in chain order
 */
export async function resolveArgumentChain(
  manager: IPluginManager<IPluginCommandArgument>,
): Promise<IPluginCommandArgument[]> {
  const definitions = await manager.getDefinitions();
  const entries = definitions.map((definition) => ({ id: definition.id, order: definition.order ?? 0 }));

  entries.sort((left, right) => {
    const byOrder = left.order - right.order;
    if (byOrder !== 0) {
      return byOrder;
    }
    // Codepoint order instead of a locale collation: the chain must be the same on every host.
    if (left.id === right.id) {
      return 0;
    }
    return left.id < right.id ? -1 : 1;
  });

  const chain: IPluginCommandArgument[] = [];
  for (const entry of entries) {
    chain.push(await manager.getInstance(entry.id));
  }

  return chain;
}

/**
 * Applies the chain to a copy of a command definition: the phase that runs before the
 * host registers the command.
 *
 * A step rewrites the definition — most often it declares an argument it can fill as
 * optional, so the surface stops demanding it. The definitions `getDefinitions()` hands
 * out are cached and shared, so the steps work on a deep copy: a relaxed `required` must
 * not leak to a host that runs without that step. Steps run in chain order, each one
 * receiving the result of the previous.
 * @param definition Definition the host is about to register
 * @param chain Steps in chain order, as returned by `resolveArgumentChain`
 * @returns Definition the host registers instead of the cached one
 * @throws Error when a step makes a positional argument optional and the argument is not the last one
 */
export function applyArgumentChain(
  definition: IPluginCommandDefinition,
  chain: readonly IPluginCommandArgument[],
): IPluginCommandDefinition {
  let transformed = clonePlainValue(definition) as IPluginCommandDefinition;

  for (const step of chain) {
    transformed = step.transformDefinition(transformed);
  }

  assertFilledPositionalsLast(definition, transformed);

  return transformed;
}

/**
 * Deep-copies the plain data of a value: arrays and plain objects are copied, while
 * anything else — the class reference `pluginClass`, a `parseArg` parser, a primitive —
 * is shared as it is.
 *
 * `structuredClone` cannot be used here: it rejects a definition, which carries functions.
 */
function clonePlainValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => clonePlainValue(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const copy: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    copy[key] = clonePlainValue(entry);
  }

  return copy;
}

/** A value whose data can be copied key by key: an object literal rather than a class instance. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as unknown;

  return prototype === Object.prototype || prototype === null;
}

/**
 * Rejects a step that makes a positional argument optional unless that argument is the
 * last one.
 *
 * A positional argument is matched by its position, so dropping its `required` shifts the
 * meaning of the arguments that follow: with `[project] <name>`, `task add my-task` fills
 * `project` with `my-task` and leaves `name` empty. The regular place of a filled argument
 * is therefore an option — it has no position at all; a positional one is allowed only
 * last, where nothing follows it.
 * @param original Definition as the manager caches it
 * @param transformed Definition after the chain has been applied
 * @throws Error naming the command, the argument and the rule it breaks
 */
function assertFilledPositionalsLast(
  original: IPluginCommandDefinition,
  transformed: IPluginCommandDefinition,
): void {
  const originalArguments = original.config.arguments ?? [];
  const transformedArguments = transformed.config.arguments ?? [];
  const lastPosition = transformedArguments.length - 1;

  for (const [position, argument] of transformedArguments.entries()) {
    if (argument.required === true || position === lastPosition) {
      continue;
    }

    const cachedArgument = originalArguments.find((entry) => entry.name === argument.name);

    if (cachedArgument?.required !== true) {
      continue;
    }

    throw new Error(
      `Command '${transformed.id}' (${transformed.command}): argument '${argument.name}' is filled ` +
        `by the argument chain, so it must be declared as an option or be the last positional ` +
        `argument of the command; it is positional argument ${position + 1} of ${transformedArguments.length}.`,
    );
  }
}

/**
 * Verifies that every argument name the discovered chain steps declare is registered.
 * A shared constant with a typo matches no argument, so the step would silently fill
 * nothing; the start of the app fails instead.
 * @param definitions Definitions of the discovered argument chain steps
 * @throws Error naming the unregistered names and listing the registered ones
 */
export function assertKnownArgumentNames(definitions: readonly IPluginCommandArgumentDefinition[]): void {
  // `?? []` covers chain steps written in JS, where the declared table cannot be type-checked.
  const declaredNames = definitions.flatMap((definition) => definition.argumentNames ?? []);
  const unknownNames = [...new Set(declaredNames.filter((name) => findArgumentByName(name) === undefined))];

  if (unknownNames.length === 0) {
    return;
  }

  const knownNames = ARGUMENT_REGISTRY.join(', ');
  const message = `Unknown command argument name(s): ${unknownNames.join(', ')}. Known names: ${knownNames}`;
  throw new Error(message);
}

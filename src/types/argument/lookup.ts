import { ARGUMENT_REGISTRY } from './registry';

/**
 * Looks the argument name up in the registry of the names the monorepo uses.
 * @param name Name taken from the table of a chain step or from a command definition
 * @returns Registered name, or `undefined` when the name is not registered
 */
export function findArgumentByName(name: string): string | undefined {
  return ARGUMENT_REGISTRY.find((entry) => entry === name);
}

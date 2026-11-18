import type { ICommandArgument, ICommandOption } from '../../types/commander';

import { isValueMissing } from '../command-argument/utils';

import type { ICommandConfig } from './types';

/**
 * Checks the values a command is about to receive against its definition.
 *
 * The check runs after the argument chain, not inside a step: a value may arrive from the
 * command line, from an MCP call or from any step of the chain, and the host that parsed it
 * knows only half of the picture. A command of the MCP server has no parser at all — its
 * schema describes the argument object and leaves the values untouched — so the validation
 * cannot live in the CLI parser either.
 *
 * Three things are checked: names the command does not declare, positional arguments
 * declared required and still empty, and values outside the declared `choices`. `required`
 * of an *option* is not a presence check: in a command definition it marks an option that
 * takes a value (`--scope <scope>`), while the JSON Schema of the MCP surfaces reads the
 * same flag as "the client must send it". A command may therefore declare a required option
 * and be run without it (`task/list` does), and the pipeline keeps the reading of the CLI.
 * @param config Command config with the arguments and options of the command
 * @param commandId Identifier of the command, for the messages of the violations
 * @param values Values the command is about to receive
 * @returns Violations in the order they were found; an empty list means the values are accepted
 */
export function validateCommandValues(
  config: ICommandConfig,
  commandId: string,
  values: Record<string, unknown>,
): string[] {
  const declaredArguments = config.arguments ?? [];
  const declaredOptions = config.options ?? [];
  const declaredNames = new Set([...declaredArguments, ...declaredOptions].map((entry) => entry.name));

  const violations: string[] = [];
  const unknownNames = Object.keys(values).filter((name) => !declaredNames.has(name));

  if (unknownNames.length > 0) {
    violations.push(`Command '${commandId}' does not declare argument(s): ${unknownNames.join(', ')}.`);
  }

  const missingNames = declaredArguments
    .filter((argument) => argument.required === true && isValueMissing(values[argument.name]))
    .map((argument) => argument.name);

  if (missingNames.length > 0) {
    violations.push(`Command '${commandId}': required argument(s) are not filled: ${missingNames.join(', ')}.`);
  }

  for (const entry of [...declaredArguments, ...declaredOptions]) {
    const rejected = findRejectedValue(entry, values[entry.name]);

    if (rejected !== undefined) {
      const allowed = (entry.choices ?? []).join(' | ');
      violations.push(`Command '${commandId}': '${entry.name}' is '${rejected}', expected one of: ${allowed}.`);
    }
  }

  return violations;
}

/**
 * Finds a value of an argument or option that its declared `choices` do not allow.
 *
 * A variadic argument carries a list of values, and its `choices` constrain the items of the
 * list rather than the list itself, as the MCP schema of the argument declares them. An
 * empty value is not checked: a missing argument is the business of the `required` check,
 * and a value of another type cannot match a list of strings.
 * @param entry Declaration of the argument or option
 * @param value Value the command is about to receive
 * @returns The rejected value as text, or `undefined` when the value is allowed or absent
 */
function findRejectedValue(entry: ICommandArgument | ICommandOption, value: unknown): string | undefined {
  const { choices } = entry;

  if (!choices || choices.length === 0 || isValueMissing(value)) {
    return undefined;
  }

  const candidates = Array.isArray(value) ? value : [value];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !choices.includes(candidate)) {
      return String(candidate);
    }
  }

  return undefined;
}

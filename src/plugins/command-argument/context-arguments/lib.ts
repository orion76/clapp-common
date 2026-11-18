import type { ICommandConfig } from '../../../plugin-types/command/types';

/**
 * Drops `required` from the arguments and options of the command that the chain step can
 * fill, so the host registers them as optional: commander stops rejecting a run without
 * them, and the help and the MCP schema show them as optional too.
 *
 * A positional argument is matched by its position, so only the last one may lose
 * `required`: dropping it from an earlier argument shifts the meaning of the arguments
 * that follow (`[project] <name>` takes the first value for `project` and leaves `name`
 * empty). Such an argument stays required — the whole chain is checked for that rule again
 * after it has been applied, and a command that declares the argument in the middle would
 * fail the start there.
 * @param config Command config with the arguments and options of the command
 * @param names Names of the arguments the step fills
 * @returns Copy of the config with the relaxed declarations; the given config is not mutated
 */
export function relaxFilledArguments(config: ICommandConfig, names: readonly string[]): ICommandConfig {
  const filled = new Set(names);
  const relaxed: ICommandConfig = { ...config };
  const positionals = config.arguments;
  const options = config.options;

  if (positionals) {
    const lastPosition = positionals.length - 1;

    relaxed.arguments = positionals.map((positional, position) =>
      filled.has(positional.name) && position === lastPosition ? { ...positional, required: false } : positional,
    );
  }

  if (options) {
    relaxed.options = options.map((option) => (filled.has(option.name) ? { ...option, required: false } : option));
  }

  return relaxed;
}

/**
 * Tells whether the command declares the argument or option with the given name. A step
 * fills only what the command knows, so the arguments of an action never carry a value the
 * action did not declare.
 * @param config Command config with the arguments and options of the command
 * @param name Name of the argument or option
 */
export function declaresArgument(config: ICommandConfig, name: string): boolean {
  const declared = [...(config.arguments ?? []), ...(config.options ?? [])];

  return declared.some((entry) => entry.name === name);
}

/**
 * Extracts the message of a caught value, which the language keeps as `unknown`.
 * @param error Caught value
 */
export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

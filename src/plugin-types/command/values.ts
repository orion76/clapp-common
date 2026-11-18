import type { IArgsAndOpts } from '../../types/events';
import { isValueMissing } from '../command-argument/utils';

import type {
  IAppliedArgumentPatch,
  ICommandConfig,
  ICommandValuesInput,
  UCommandPipelineInput,
} from './types';

/**
 * Tells whether the host handed the pipeline values addressed by name.
 * @param input Input of the command pipeline
 */
export function isValuesInput(input: UCommandPipelineInput): input is ICommandValuesInput {
  return 'values' in input;
}

/**
 * Brings the input of any host to the shape the rest of the pipeline works with: values
 * addressed by the names the command declares.
 *
 * A positional argument is the value at the index the command declares it at, so the array a
 * CLI host parses turns into values by the names of `config.arguments`; an MCP call arrives
 * as such an object already. Everything past this point works on names, which is why both
 * hosts are served by one pipeline.
 * @param config Command config with the arguments and options of the command
 * @param input Input as the host parsed it
 * @returns Values by argument and option name; a positional argument the host left out stays
 * `undefined` under its name, as the CLI hands it over
 */
export function collectCommandValues(config: ICommandConfig, input: UCommandPipelineInput): Record<string, unknown> {
  if (isValuesInput(input)) {
    return { ...input.values };
  }

  const values: Record<string, unknown> = { ...input.opts };

  for (const [position, argument] of (config.arguments ?? []).entries()) {
    values[argument.name] = input.args[position];
  }

  return values;
}

/**
 * Builds the view of the values the command lifecycle hooks carry: positional values in the
 * order the command declares them and options by name.
 *
 * A listener of `command:start` and `command:arguments` sees the command as the host parsed
 * it, and a host that addresses values by name — the MCP server — has no positions of its
 * own, so the view is built from the declaration instead of the raw input.
 * @param config Command config with the arguments and options of the command
 * @param values Values by argument and option name
 * @returns Positional values and options of the command
 */
export function toArgumentViews(config: ICommandConfig, values: Record<string, unknown>): IArgsAndOpts {
  const args = (config.arguments ?? []).map((argument) => values[argument.name]);
  const opts: Record<string, unknown> = {};

  for (const option of config.options ?? []) {
    if (option.name in values) {
      opts[option.name] = values[option.name];
    }
  }

  return { args, opts };
}

/**
 * Applies the values one chain step filled over the values the host parsed.
 *
 * A step returns only what it filled, so its result is a patch. A patch never replaces a
 * value the host already has: the value a user typed or a client sent wins over a filled
 * one, which is why such a proposal is reported back as `kept` instead of applied.
 * @param values Values of the command before the step
 * @param patch Values the step filled
 * @returns Values with the patch applied, plus what was applied and what was kept
 */
export function applyFilledValues(
  values: Record<string, unknown>,
  patch: Record<string, unknown>,
): IAppliedArgumentPatch {
  const applied: IAppliedArgumentPatch = { values: { ...values }, filled: {}, kept: {} };

  for (const [argument, value] of Object.entries(patch)) {
    if (isValueMissing(value)) {
      continue;
    }

    if (!isValueMissing(applied.values[argument])) {
      applied.kept[argument] = value;
      continue;
    }

    applied.values[argument] = value;
    applied.filled[argument] = value;
  }

  return applied;
}

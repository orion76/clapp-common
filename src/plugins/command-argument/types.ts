import type { TContextIdentifier } from '../../plugin-types/context';

/**
 * One row of the table of a chain step: the argument the step fills and the token of the
 * context whose value becomes the argument value. The argument is addressed by its `name`,
 * the identifier a command definition declares.
 */
export interface IArgumentContextBinding {
  /** Name of the command argument or option the step fills. */
  argument: string;
  /** Token of the context plugin that provides the value. */
  context: TContextIdentifier<string>;
}

/**
 * Table of a chain step: one module per argument domain, gathered by the barrel of the
 * step. `readonly`, because a step declares its table once and never rewrites it.
 */
export type TArgumentContextTable = readonly IArgumentContextBinding[];

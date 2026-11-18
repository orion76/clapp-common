/**
 * Debug report of the argument chain: which step provided the value of which argument.
 *
 * The value of an argument can come from the command line, from an MCP call and from every
 * step of the chain, and a run whose argument holds an unexpected value is otherwise
 * explained only by reading the plugins. The report names the command, the argument, the
 * step and the value, so the substitution is traced from the output of the run itself.
 *
 * The report goes to stderr and only when `CLAPP_DEBUG_ARGUMENTS` is set: a command that
 * fills its arguments is the normal case, and the lines would drown the output of the
 * command without telling its user anything.
 */

import type { IArgumentFillReport } from './types';

/** Environment variable that turns the report of the argument chain on. */
const DEBUG_ENV = 'CLAPP_DEBUG_ARGUMENTS';

/**
 * Reports the values a chain step provided for a command, when the debug switch is on.
 * @param report What the step did with the values of the command
 */
export function reportArgumentFill(report: IArgumentFillReport): void {
  if (!isDebugEnabled()) {
    return;
  }

  for (const line of describeFill(report)) {
    process.stderr.write(`[clapp] ${line}\n`);
  }
}

/**
 * Builds the lines of the report of one step.
 * @param report What the step did with the values of the command
 * @returns One line per argument the step touched
 */
function describeFill({ command, step, filled, kept }: IArgumentFillReport): string[] {
  const lines = Object.entries(filled).map(
    ([argument, value]) => `command '${command}': argument '${argument}' = ${describeValue(value)} (step '${step}')`,
  );
  const keptLines = Object.entries(kept).map(
    ([argument, value]) =>
      `command '${command}': argument '${argument}': kept, step '${step}' proposed ${describeValue(value)}`,
  );

  return [...lines, ...keptLines];
}

/**
 * Renders a value of an argument for the report. The values are plain data of a definition,
 * so JSON is enough; the fallback covers the values JSON refuses to represent.
 * @param value Value to render
 */
function describeValue(value: unknown): string {
  if (typeof value === 'string') {
    return `'${value}'`;
  }

  try {
    const json = JSON.stringify(value);

    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

/** Tells whether the debug switch is on. */
function isDebugEnabled(): boolean {
  const value = process.env[DEBUG_ENV];

  return value !== undefined && value !== '' && value !== '0' && value !== 'false';
}

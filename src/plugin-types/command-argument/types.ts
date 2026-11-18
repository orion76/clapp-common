import type { IPlugin, IPluginDefinition, IType } from '@orion76/plugin';

import type { ICommandResult, IPluginCommandDefinition } from '../command/types';

/**
 * Definition of one step of the command argument chain.
 *
 * `order` is the position of the step: the chain runs in ascending order and ties
 * are broken by `id`, so the result never depends on the order of the discovery
 * glob. A definition without `order` runs at position `0`.
 * @template P Plugin class the definition is attached to
 */
export interface IPluginCommandArgumentDefinition<P extends IPluginCommandArgument = IPluginCommandArgument>
  extends IPluginDefinition {
  /** Chain position: ascending, `0` by default; ties are resolved by `id`. */
  order?: number;
  /**
   * Names of the arguments this step can provide, declared as a table rather than derived
   * from the step: the check runs at startup on the discovered definitions, before any
   * instance or context is resolved.
   */
  argumentNames: readonly string[];
  pluginClass: IType<P>;
}

/**
 * Authoring-time definition of a chain step: `pluginClass` is attached by the
 * `@NodePlugin` decorator, so the author does not write it.
 * @template P Plugin class the definition is attached to
 */
export type IPluginCommandArgumentDefinitionData<P extends IPluginCommandArgument = IPluginCommandArgument> = Omit<
  IPluginCommandArgumentDefinition<P>,
  'pluginClass'
>;

/**
 * What a chain step operates on: the command definition the host is about to
 * register and the values it has already parsed.
 */
export interface ICommandArgumentState {
  definition: IPluginCommandDefinition;
  /** Values already parsed by the host: positional arguments by name, options by name. */
  values: Record<string, unknown>;
}

/**
 * One step of the command argument chain. The host asks every step of the chain
 * for the arguments it can provide: the definition is rewritten before the command
 * is registered, the values are filled once the host has parsed them.
 */
export interface IPluginCommandArgument extends IPlugin {
  definition: IPluginCommandArgumentDefinition;
  /**
   * Rewrites the command definition before the host registers it. The step is static:
   * it resolves neither contexts nor DI, otherwise the contexts of every command would
   * be resolved at startup.
   * @param definition Definition the host is about to register
   * @returns Definition the host registers instead; the cached definition is not mutated
   */
  transformDefinition(definition: IPluginCommandDefinition): IPluginCommandDefinition;
  /**
   * Fills the arguments this step knows how to provide, leaving the rest untouched.
   *
   * A step reports what it filled rather than the whole value object, so the steps of the
   * chain compose without fighting over ownership of a value. A step that cannot resolve
   * the value of an argument fails the command instead of throwing: the reason travels to
   * the surface as the text of the failed result.
   * @param state Definition of the command plus the values the host has already parsed
   * @returns Filled values in `data` only (applied as a patch over `state.values`), or a
   * failed result with the reason in `error`
   */
  fill(state: ICommandArgumentState): Promise<ICommandResult<Record<string, unknown>>>;
}

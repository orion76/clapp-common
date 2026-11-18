import { ICommandResult } from "../plugin-types";



/**
 * Describes a single application lifecycle hook: the tuple of arguments passed
 * into `hook` and the type of the value the hook resolves to.
 * @template A Hook argument tuple
 * @template R Hook result type
 */
export interface ILifecycle<A extends {} = {}, R = void> {
  id: string;
  type: string;
  data: A;
  result?: R;
}

/**
 * Lifecycle hook listener. It receives the hook arguments and may return a new
 * pipeline state (the hook result) synchronously or asynchronously. Returning
 * `void` keeps the current state unchanged.
 * @template L Lifecycle descriptor
 */
export type THookListener<L extends ILifecycle> = (args: L['data']) => Promise<L['result']>;

/**
 * Structural constraint requiring every property of a lifecycle map to be an
 * `ILifecycle` descriptor. It is applied to the map generic of `IEventBus` so
 * indexed access (`M[K]`) is known to be a lifecycle.
 * @template M Lifecycle map
 */
export type TLifecycleMapConstraint<M extends Record<string, ILifecycle>> = { [K in keyof M]: ILifecycle };

export type TCommandEventData<D extends {}> = {
  id: string;
  type: string;
  data: D
}


export interface IArgsAndOpts {
  args: unknown[];
  opts: Record<string, unknown>
}

/**
 * Global lifecycle map of the CLI runtime. Library and application code may
 * extend it via declaration merging to register additional lifecycle hooks.
 */
export interface IClappLifecycleMap {
  /** Emitted before the command handler is resolved, right after `command:start`. */
  'command:start': ILifecycle<IArgsAndOpts, void>;
  /** Emitted before the argument chain completes the values the host has parsed. */
  'command:arguments': ILifecycle<IArgsAndOpts, void>;
  /** Emitted before the plugin `action` runs, carrying the resolved plugin arguments. */
  'command:run': ILifecycle<{ args: unknown }, void>;
  /** Emitted after the plugin `action` resolves successfully. */
  'command:end': ILifecycle<{ result: ICommandResult }, void>;
  /**
   * Emitted when the command does not complete: a chain step that cannot fill its arguments,
   * values that do not satisfy the definition, or an action that throws or reports a failed
   * result.
   */
  'command:error': ILifecycle<{ error: unknown }, void>;
}


export interface IEventBus<M extends TLifecycleMapConstraint<M>> {
  hook<K extends keyof M & string>(event: K, args: TCommandEventData<M[K]['data']>): Promise<M[K]['result']>;
  on<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void;
  once<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void;
  off<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): void;
}

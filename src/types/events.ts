import { ICommandResult } from "../plugin-types";


/**
 * Describes a single application lifecycle hook: the tuple of arguments passed
 * into `hook` and the type of the value the hook resolves to.
 * @template A Hook argument tuple
 * @template R Hook result type
 */
export interface ILifecycle<A extends unknown[] = unknown[], R = void> {
  args: A;
  result: R;
}

/**
 * Lifecycle hook listener. It receives the hook arguments and may return a new
 * pipeline state (the hook result) synchronously or asynchronously. Returning
 * `void` keeps the current state unchanged.
 * @template L Lifecycle descriptor
 */
export type THookListener<L extends ILifecycle<unknown[], unknown>> = (
  ...args: L['args']
) => L['result'] | void | Promise<L['result'] | void>;

/**
 * Structural constraint requiring every property of a lifecycle map to be an
 * `ILifecycle` descriptor. It is applied to the map generic of `IEventBus` so
 * indexed access (`M[K]`) is known to be a lifecycle.
 * @template M Lifecycle map
 */
export type TLifecycleMapConstraint<M = IClappLifecycleMap> = { [K in keyof M]: ILifecycle<unknown[], unknown> };

/**
 * Global lifecycle map of the CLI runtime. Library and application code may
 * extend it via declaration merging to register additional lifecycle hooks.
 */
export interface IClappLifecycleMap {
  /** Emitted before the command handler is resolved, right after `command:start`. */
  'command:start': ILifecycle<[{ id: string; type: string; args: unknown[]; opts: Record<string, unknown> }], void>;
  /** Emitted before `getArguments` turns the raw CLI input into typed plugin arguments. */
  'command:arguments': ILifecycle<[{ id: string; type: string; args: unknown[]; opts: Record<string, unknown> }], void>;
  /** Emitted before the plugin `action` runs, carrying the resolved plugin arguments. */
  'command:run': ILifecycle<[{ id: string; type: string; args: unknown }], void>;
  /** Emitted after the plugin `action` resolves successfully. */
  'command:end': ILifecycle<[{ id: string; type: string; result: ICommandResult }], void>;
  /** Emitted when argument resolution or the plugin `action` throws. */
  'command:error': ILifecycle<[{ id: string; type: string; error: unknown }], void>;
}

/**
 * Asynchronous lifecycle hook bus. Shared through the DI container, so plugins,
 * the framework and the host application can communicate without direct
 * coupling. Hooks run as a sequential pipeline: every listener is awaited and a
 * returned value becomes the state seen by the following listeners.
 * @template M Lifecycle map
 */
export interface IEventBus<M extends TLifecycleMapConstraint<M> = IClappLifecycleMap> {
  /**
   * Run all listeners of a lifecycle hook sequentially as a pipeline, awaiting
   * each listener. A non-`void` return value becomes the state passed to the
   * following listeners and the resolved result. Without listeners the initial
   * argument is resolved unchanged.
   * @param event Hook name
   * @param args Hook arguments
   */
  hook<K extends keyof M & string>(event: K, ...args: M[K]['args']): Promise<M[K]['result']>;
  /**
   * Subscribe to a lifecycle hook.
   * @param event Hook name
   * @param listener Hook listener
   * @returns Unsubscribe function
   */
  on<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void;
  /**
   * Subscribe to a lifecycle hook once; the listener is removed before it is invoked.
   * @param event Hook name
   * @param listener Hook listener
   * @returns Unsubscribe function
   */
  once<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void;
  /**
   * Unsubscribe a previously registered listener.
   * @param event Hook name
   * @param listener Hook listener
   */
  off<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): void;
}

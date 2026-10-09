import { ICommandResult } from './plugin';

/**
 * Event listener: may be synchronous or asynchronous. The event bus awaits
 * asynchronous listeners before resolving `emit`.
 * @template P Payload type
 */
export type TListener<P> = (payload: P) => void | Promise<void>;

/**
 * Global event map of the CLI runtime. Library and application code may extend
 * it via declaration merging to register additional events.
 */
export interface IClappEventMap {
  'app:create': { id: string; type: string; args: unknown[]; opts: Record<string, unknown> };
  /** Emitted before the command handler is resolved, right after `command:start`. */
  'command:start': { id: string; type: string; args: unknown[]; opts: Record<string, unknown> };
  /** Emitted before `getArguments` turns the raw CLI input into typed plugin arguments. */
  'command:arguments': { id: string; type: string; args: unknown[]; opts: Record<string, unknown> };
  /** Emitted before the plugin `action` runs, carrying the resolved plugin arguments. */
  'command:run': { id: string; type: string; args: unknown };
  /** Emitted after the plugin `action` resolves successfully. */
  'command:end': { id: string; type: string; result: ICommandResult };
  /** Emitted when argument resolution or the plugin `action` throws. */
  'command:error': { id: string; type: string; error: unknown };
}

/**
 * Asynchronous event bus. Shared through the DI container, so plugins, the
 * framework and the host application can communicate without direct coupling.
 * @template E Event map
 */
export interface IEventBus<E extends object = IClappEventMap> {
  /**
   * Notify all listeners of an event, awaiting each listener sequentially.
   * @param event Event name
   * @param payload Event payload
   */
  emit<K extends keyof E & string>(event: K, payload: E[K]): Promise<void>;
  /**
   * Subscribe to an event.
   * @param event Event name
   * @param listener Event listener
   * @returns Unsubscribe function
   */
  on<K extends keyof E & string>(event: K, listener: TListener<E[K]>): () => void;
  /**
   * Subscribe to an event once; the listener is removed before it is invoked.
   * @param event Event name
   * @param listener Event listener
   * @returns Unsubscribe function
   */
  once<K extends keyof E & string>(event: K, listener: TListener<E[K]>): () => void;
  /**
   * Unsubscribe a previously registered listener.
   * @param event Event name
   * @param listener Event listener
   */
  off<K extends keyof E & string>(event: K, listener: TListener<E[K]>): void;
}

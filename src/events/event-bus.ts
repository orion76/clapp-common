import { injectable } from 'inversify';
import { IClappLifecycleMap, IEventBus, TCommandEventData, THookListener, TLifecycleMapConstraint } from '../types';
import type { TAnyHookListener } from './types';

/**
 * Default asynchronous lifecycle hook bus: `hook` awaits the listeners of an event
 * sequentially in registration order and passes each one the `data` payload of the
 * `{ id, type, data }` argument. Listener failures do not stop the remaining ones:
 * a single failure is re-thrown as is, several are collected into `AggregateError`.
 * @template M Lifecycle map
 */
@injectable()
export class EventBus<M extends TLifecycleMapConstraint<M>> implements IEventBus<TLifecycleMapConstraint<M>> {
  private readonly _listeners = new Map<string, Set<TAnyHookListener>>();

  /**
   * Awaits every listener registered for the event in registration order. Listeners
   * receive `args.data` and their return values are discarded, so the hook resolves
   * `undefined`; listener failures are reported only after the whole batch is awaited.
   * @param event Lifecycle event whose listeners run
   * @param args Event descriptor carrying the payload handed over to the listeners
   */
  async hook<K extends keyof M & string>(event: K, args: TCommandEventData<M[K]['data']>): Promise<M[K]['result']> {
    const listeners = this._listeners.get(event);
    const errors: unknown[] = [];

    if (listeners) {
      for (const listener of [...listeners]) {
        try {
          await listener(args.data);
        } catch (error) {
          errors.push(error);
        }
      }
    }

    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw new AggregateError(errors, `Hook "${event}" listeners failed`);
    }

    return undefined as unknown as M[K]['result'];
  }

  on<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void {
    let listeners = this._listeners.get(event);
    if (!listeners) {
      listeners = new Set();
      this._listeners.set(event, listeners);
    }
    listeners.add(listener as TAnyHookListener);
    return () => this.off(event, listener);
  }

  once<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): () => void {
    const wrapper: THookListener<M[K]> = (args) => {
      this.off(event, wrapper);
      return listener(args);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof M & string>(event: K, listener: THookListener<M[K]>): void {
    const listeners = this._listeners.get(event);
    if (!listeners) {
      return;
    }
    listeners.delete(listener as TAnyHookListener);
    if (listeners.size === 0) {
      this._listeners.delete(event);
    }
  }
}

import { randomNumber } from '@se-oss/rand';
import { clearTimeout as safeClearTimeout, setTimeout as safeSetTimeout } from '@se-oss/timeout';

import type { DelayStats, Options } from './typings';

const clearMethods = new WeakMap<Promise<unknown>, () => void>();

/**
 * Creates a new `delay` instance with custom `setTimeout` and `clearTimeout` functions.
 *
 * @param options - Options for creating the delay function.
 * @param options.clearTimeout - A custom `clearTimeout` function.
 * @param options.setTimeout - A custom `setTimeout` function.
 * @returns A `delay` function.
 */
export function createDelay({
  clearTimeout: defaultClear,
  setTimeout: defaultSet,
}: {
  clearTimeout?: (timeoutId: any) => void;
  setTimeout?: (
    callback: (...args: any[]) => void,
    milliseconds: number,
    ...args: any[]
  ) => unknown;
} = {}) {
  // We cannot use `async` here as we need the promise identity.
  function delay<T>(
    milliseconds: number,
    options: Options<T> & { stats: true }
  ): Promise<{ value: T; stats: DelayStats }>;
  function delay<T>(milliseconds: number, options?: Options<T>): Promise<T>;
  function delay<T>(
    milliseconds: number,
    { value, signal, stats }: Options<T> = {}
  ): Promise<T | { value: T; stats: DelayStats }> {
    if (signal?.aborted) {
      return Promise.reject(signal.reason);
    }

    let timeoutId: any;
    let settle: () => void;
    let rejectFunction: (reason?: any) => void;
    const clear = defaultClear ?? clearTimeout;

    const signalListener = () => {
      clear(timeoutId);
      rejectFunction(signal!.reason);
    };

    const cleanup = () => {
      if (signal) {
        signal.removeEventListener('abort', signalListener);
      }
    };

    const startTime = Date.now();

    const delayPromise = new Promise<any>((resolve, reject) => {
      settle = () => {
        cleanup();
        if (stats) {
          const drift = Date.now() - startTime - milliseconds;
          resolve({ value, stats: { drift } });
        } else {
          resolve(value as T);
        }
      };

      rejectFunction = reject;
      timeoutId = (defaultSet ?? setTimeout)(settle, milliseconds);
    });

    if (signal) {
      signal.addEventListener('abort', signalListener, { once: true });
    }

    clearMethods.set(delayPromise, () => {
      clear(timeoutId);
      timeoutId = null;
      settle();
    });

    return delayPromise;
  }

  return delay;
}

/**
 * Delay a promise for a specified amount of time.
 *
 * @param milliseconds - The number of milliseconds to delay.
 * @param options - Options for the delay.
 * @returns A promise that resolves after the specified milliseconds.
 */
const delay = createDelay({
  setTimeout: safeSetTimeout,
  clearTimeout: safeClearTimeout,
});

export default delay;

/**
 * Delay a promise for a random amount of time between a minimum and maximum.
 *
 * @param minimum - The minimum number of milliseconds to delay.
 * @param maximum - The maximum number of milliseconds to delay.
 * @param options - Options for the delay.
 * @returns A promise that resolves after a random amount of time.
 */
export function rangeDelay<T>(
  minimum: number,
  maximum: number,
  options: Options<T> & { stats: true }
): Promise<{ value: T; stats: DelayStats }>;
export function rangeDelay<T>(minimum: number, maximum: number, options?: Options<T>): Promise<T>;
export function rangeDelay<T>(minimum: number, maximum: number, options?: Options<T>): any {
  return delay(randomNumber(minimum, maximum), options);
}

/**
 * Clears a pending delay. The promise will resolve immediately.
 *
 * @param promise - The promise to clear.
 */
export function clearDelay(promise: Promise<unknown>): void {
  clearMethods.get(promise)?.();
}

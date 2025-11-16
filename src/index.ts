import { randomNumber } from '@se-oss/rand';
import { clearTimeout as safeClearTimeout, setTimeout as safeSetTimeout } from '@se-oss/timeout';

import type { Options } from './typings';

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
  return <T>(milliseconds: number, { value, signal }: Options<T> = {}): Promise<T> => {
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

    const delayPromise = new Promise<T>((resolve, reject) => {
      settle = () => {
        cleanup();
        resolve(value as T);
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
  };
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
export function rangeDelay<T>(minimum: number, maximum: number, options?: Options<T>): Promise<T> {
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

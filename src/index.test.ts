import inRange from 'in-range';
import timeSpan from 'time-span';
import { describe, expect, it } from 'vitest';

import delay, { clearDelay, createDelay, rangeDelay } from './index';

describe('delay', () => {
  it('returns a resolved promise', async () => {
    const end = timeSpan();
    await delay(50);
    expect(inRange(end(), { start: 30, end: 70 })).toBe(true);
  });

  it('able to resolve a falsy value', async () => {
    expect(await delay(50, { value: 0 })).toBe(0);
  });

  it('delay defaults to 0 ms', async () => {
    const end = timeSpan();
    await delay(0);
    expect(end() < 30).toBe(true);
  });

  it('can clear a delayed resolution', async () => {
    const end = timeSpan();
    const delayPromise = delay(1000, { value: 'success!' });

    clearDelay(delayPromise);
    const success = await delayPromise;

    expect(end() < 30).toBe(true);
    expect(success).toBe('success!');
  });

  it('resolution can be aborted with an AbortSignal', async () => {
    const end = timeSpan();
    const abortController = new AbortController();

    setTimeout(() => {
      abortController.abort();
    }, 1);

    await expect(delay(1000, { signal: abortController.signal })).rejects.toThrow();

    expect(end() < 30).toBe(true);
  });

  it('resolution can be aborted with an AbortSignal if a value is passed', async () => {
    const end = timeSpan();
    const abortController = new AbortController();

    setTimeout(() => {
      abortController.abort();
    }, 1);

    await expect(delay(1000, { value: 123, signal: abortController.signal })).rejects.toThrow();

    expect(end() < 30).toBe(true);
  });

  it('rejects with AbortError if AbortSignal is already aborted', async () => {
    const end = timeSpan();

    const abortController = new AbortController();
    abortController.abort();

    await expect(delay(1000, { signal: abortController.signal })).rejects.toThrow();

    expect(end() < 30).toBe(true);
  });

  it('returns a promise that is resolved in a random range of time', async () => {
    const end = timeSpan();
    await rangeDelay(50, 150);
    expect(inRange(end(), { start: 30, end: 170 })).toBe(true);
  });

  it('can create a new instance with fixed timeout methods', async () => {
    const cleared: symbol[] = [];
    const callbacks: {
      callback: () => void;
      handle: symbol;
      ms: number;
    }[] = [];

    const custom = createDelay({
      clearTimeout(handle) {
        cleared.push(handle);
      },

      setTimeout(callback, ms) {
        const handle = Symbol('handle');
        callbacks.push({ callback, handle, ms });
        return handle;
      },
    });

    const first = custom(50, { value: 'first' });
    expect(callbacks.length).toBe(1);
    expect(callbacks[0]!.ms).toBe(50);
    callbacks[0]!.callback();
    expect(await first).toBe('first');

    const second = custom(40, { value: 'second' });
    expect(callbacks.length).toBe(2);
    expect(callbacks[1]!.ms).toBe(40);
    callbacks[1]!.callback();
    expect(await second).toBe('second');

    const third = custom(60);
    expect(callbacks.length).toBe(3);
    expect(callbacks[2]!.ms).toBe(60);
    clearDelay(third);
    expect(cleared.length).toBe(1);
    expect(cleared[0]).toBe(callbacks[2]!.handle);
  });
});

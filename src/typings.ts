export type DelayStats = {
  /**
   * The difference between the requested delay and the actual execution time.
   */
  drift: number;
};

export type Options<T> = {
  /**
   * A value to resolve in the returned promise.
   *
   * @example
   * ```
   * import delay from '@se-oss/delay';
   *
   * const result = await delay(100, { value: '☕' });
   *
   * // Executed after 100 milliseconds
   * console.log(result);
   * //=> '☕'
   * ```
   */
  value?: T;

  /**
   * An `AbortSignal` to abort the delay.
   *
   * The returned promise will be rejected with an `AbortError` if the signal is aborted.
   *
   * @example
   * ```
   * import delay from '@se-oss/delay';
   *
   * const abortController = new AbortController();
   *
   * setTimeout(() => {
   *   abortController.abort();
   * }, 500);
   *
   * try {
   *   await delay(1000, { signal: abortController.signal });
   * } catch (error) {
   *   // 500 milliseconds later
   *   console.log(error.name)
   *   //=> 'AbortError'
   * }
   * ```
   */
  signal?: AbortSignal;

  /**
   * If true, the promise will resolve to an object containing the value and stats.
   *
   * @example
   * ```
   * import delay from '@se-oss/delay';
   *
   * const { value, stats } = await delay(100, { value: '☕', stats: true });
   *
   * console.log(value);
   * //=> '☕'
   *
   * console.log(stats.drift);
   * //=> 2
   * ```
   */
  stats?: boolean;
};

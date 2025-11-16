export type Options<T> = {
  /**
	A value to resolve in the returned promise.

	@example
	```
	import delay from '@se-oss/delay';

	const result = await delay(100, {value: '🦄'});

	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
	```
	*/
  value?: T;

  /**
	An `AbortSignal` to abort the delay.

	The returned promise will be rejected with an `AbortError` if the signal is aborted.

	@example
	```
	import delay from '@se-oss/delay';

	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 500);

	try {
		await delay(1000, {signal: abortController.signal});
	} catch (error) {
		// 500 milliseconds later
		console.log(error.name)
		//=> 'AbortError'
	}
	```
	*/
  signal?: AbortSignal;
};

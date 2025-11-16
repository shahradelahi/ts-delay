# @se-oss/delay

[![CI](https://github.com/shahradelahi/ts-delay/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/shahradelahi/ts-delay/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/delay.svg)](https://www.npmjs.com/package/@se-oss/delay)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@se-oss/delay)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/delay)](https://packagephobia.com/result?p=@se-oss/delay)

A lightweight utility to delay a promise for a specified amount of time. It's a modern alternative to `setTimeout` inside an `async` function.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [API](#-api)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/delay
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install @se-oss/delay
```

**yarn**

```bash
yarn add @se-oss/delay
```

</details>

## 📖 Usage

### Basic Delay

```typescript
import delay from '@se-oss/delay';

console.log('Waiting...');
await delay(1000);
console.log('Done!');
```

### Delay with a value

The returned promise resolves with a value.

```typescript
import delay from '@se-oss/delay';

const result = await delay(100, { value: '🦄' });
console.log(result);
//=> '🦄'
```

### Random Delay

Delay for a random amount of time within a specified range.

```typescript
import { rangeDelay } from '@se-oss/delay';

console.log('Waiting for a random time between 100ms and 200ms...');
await rangeDelay(100, 200);
console.log('Done!');
```

### Clear a Delay

You can clear a delay before it resolves.

```typescript
import delay, { clearDelay } from '@se-oss/delay';

const delayedPromise = delay(1000, { value: 'done' });

setTimeout(() => {
  clearDelay(delayedPromise);
}, 500);

const result = await delayedPromise;
// The promise resolves immediately with 'done' when cleared.
console.log(result);
//=> 'done'
```

### Abort Signal

Abort a delay using an `AbortSignal`.

```typescript
import delay from '@se-oss/delay';

const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 500);

try {
  await delay(1000, { signal: controller.signal });
} catch (error) {
  console.log(error.name); // 500 milliseconds later
  //=> 'AbortError'
}
```

## 📚 API

### delay(milliseconds, options?)

Returns a promise that resolves after the specified `milliseconds`.

#### milliseconds

Type: `number`

The number of milliseconds to delay.

#### options

Type: `object`

##### value

Type: `T`

A value to resolve in the returned promise.

##### signal

Type: `AbortSignal`

An `AbortSignal` to abort the delay. The returned promise will be rejected with the signal's reason if the signal is aborted.

### rangeDelay(minimum, maximum, options?)

Returns a promise that resolves after a random amount of time between `minimum` and `maximum` milliseconds.

#### minimum

Type: `number`

The minimum number of milliseconds to delay.

#### maximum

Type: `number`

The maximum number of milliseconds to delay.

#### options

Same options as `delay`.

### clearDelay(promise)

Clears a pending delay. The promise will resolve immediately with its configured `value`.

#### promise

Type: `Promise<unknown>`

The promise returned from `delay()` or `rangeDelay()`.

### createDelay(options)

Creates a new `delay` instance with custom `setTimeout` and `clearTimeout` functions.

#### options

Type: `object`

##### setTimeout

Type: `(callback: (...args: any[]) => void, milliseconds: number, ...args: any[]) => unknown`

A custom `setTimeout` function.

##### clearTimeout

Type: `(timeoutId: any) => void`

A custom `clearTimeout` function.

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-delay)

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-delay/graphs/contributors).

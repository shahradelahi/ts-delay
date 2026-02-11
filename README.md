<h1 align="center">
  <sup>@se-oss/delay</sup>
  <br>
  <a href="https://github.com/shahradelahi/ts-delay/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/ts-delay/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@se-oss/delay"><img src="https://img.shields.io/npm/v/@se-oss/delay.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/@se-oss/delay"><img src="https://img.shields.io/bundlephobia/minzip/@se-oss/delay" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=@se-oss/delay"><img src="https://packagephobia.com/badge?p=@se-oss/delay" alt="Install Size"></a>
</h1>

_@se-oss/delay_ is a lightweight utility to delay a promise for a specified amount of time, offering a modern alternative to `setTimeout`.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
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

```ts
import delay from '@se-oss/delay';

await delay(1000);
```

### Delay with a value

The returned promise resolves with a specified value.

```ts
import delay from '@se-oss/delay';

const result = await delay(100, { value: '☕' });
console.log(result);
//=> '☕'
```

### Execution Stats

Retrieve the actual execution drift (difference between requested and actual delay).

```ts
import delay from '@se-oss/delay';

const { value, stats } = await delay(100, { value: '☕', stats: true });

console.log(stats.drift);
//=> 2 (milliseconds)
```

### Random Delay

Delay for a random amount of time within a specified range.

```ts
import { rangeDelay } from '@se-oss/delay';

await rangeDelay(100, 200);
```

### Clear a Delay

Clear a pending delay to resolve it immediately.

```ts
import delay, { clearDelay } from '@se-oss/delay';

const promise = delay(1000, { value: '☕' });

// Sometime later...
clearDelay(promise);

const result = await promise;
//=> '☕'
```

### Abort Signal

Abort a delay using an `AbortSignal`.

```ts
import delay from '@se-oss/delay';

const controller = new AbortController();

setTimeout(() => controller.abort(), 500);

try {
  await delay(1000, { signal: controller.signal });
} catch (error) {
  console.log(error.name);
  //=> 'AbortError'
}
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/delay).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-delay).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-delay/graphs/contributors).

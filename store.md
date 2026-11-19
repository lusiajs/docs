[Back to README](../README.md)

# Store

A **store** holds a value. Markup that reads it updates when it changes. Stores work the same in `.lucia` and plain `.ts` files.

## API

| Function | Use |
|---|---|
| `store(value)` | A writable store. Read and write with `.value` |
| `store.from(() => ...)` | A read-only store derived from other stores. Cached until its inputs change |
| `store.onUpdate(() => ...)` | Run code now, then again when a store it reads changes. See [store.onUpdate](#storeonupdate) |
| `.peek()` | On any store: read without depending on it |

```ts
import { store } from "lucia";

const first = store("Ada");
const last = store("Lovelace");
const full = store.from(() => `${first.value} ${last.value}`);

function useGrace() {
  first.value = "Grace";
  last.value = "Hopper"; // markup that shows `full` updates once
}
```

> [!NOTE]
> Updates are grouped automatically. Event handlers, `bind` writes and `store.onUpdate` group their writes, so dependents update once at the end.

To read a value without depending on it, use `.peek()`:

```ts
const snapshot = count.peek();
```

## Types

| Type | Returned by | Can write |
|---|---|---|
| `Store<T>` | `store(value)` | Yes, `.value = next` |
| `ReadStore<T>` | `store.from(fn)` and `props()` | No |

## Behaviour

| Rule | Detail |
|---|---|
| Same value | Setting a value equal to the current one (`Object.is`) does nothing |
| Lazy `store.from` | It runs only when read, and only if an input changed |
| No glitches | When several values depend on one store, nothing sees a half-updated state |

## store.onUpdate

`store.onUpdate(fn)` runs `fn` once right away. After that it runs again only when a store or read store that `fn` read has changed. It returns a stop function.

```ts
import { store } from "lucia";

const count = store(0);

function logCount() {
  console.log("count is", count.value);
}

const stop = store.onUpdate(logCount); // logs "count is 0" now
count.value++;                         // logs "count is 1"
stop();
```

| Rule | Detail |
|---|---|
| Reads | Each run tracks what it reads. A read inside an `if` counts only while that branch runs |
| Other stores | A store that `fn` does not read does not re-run it |
| Peek | `.peek()` reads without tracking. Use it for values that `fn` should not depend on |
| Stop | Call the returned function to stop it |
| Component | Inside a component's `<script>`, it stops when the component is removed |

> [!TIP]
> Use `store.onUpdate` for side effects, such as logging, saving or talking to the page. Use `store.from` for values you show in markup.

## Sharing state

Put stores in a `.ts` file and import them anywhere. Every importer shares the same value.

```ts
// store.ts
import { store } from "lucia";

export const clicks = store(0);
```

```html
<script>
import { clicks } from "./store.ts";
</script>

<p>{clicks} clicks</p>
```

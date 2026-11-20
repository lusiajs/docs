[Back to README](../README.md)

# Variable

A **variable** holds a value. Markup that reads it updates when the value updates. Variables work the same in `.lucia` and plain `.ts` files.

## API

| Function                               | Use                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `variable(value)`                      | A variable you can write. Read and write with `.value`, `.get()` and `.set()`                  |
| `variable.compute(fn)`                 | A computed variable derived from other variables. Cached until its inputs update               |
| `variable.autoRun(fn)`                 | Run code now, then again when a variable it reads updates. See [autoRun](#autorun)             |
| `variable.watch([a, b], fn)`           | Run code when one of the listed variables updates. See [watch](#watch)                         |
| `count.onUpdate((now, before) => ...)` | Run code with the new and old value after each update. See [On one variable](#on-one-variable) |
| `.peek()`                              | On any variable: read without depending on it                                                  |

```ts
import { variable } from "lucia";

const first = variable("Ada");
const last = variable("Lovelace");
const full = variable.compute(() => `${first.value} ${last.value}`);

function useGrace() {
  first.value = "Grace";
  last.value = "Hopper"; // markup that shows `full` updates once
}
```

> [!NOTE]
> Updates are grouped automatically. Event handlers, `bind` writes and `variable.autoRun` group their writes, so dependents update once at the end.

## Computed variables

`variable.compute` takes a function that returns the value. There are two ways to write it.

A normal named function, which is easy to read:

```ts
function fullName() {
  return `${first.value} ${last.value}`;
}

const full = variable.compute(fullName);
```

The same thing as a short inline arrow:

```ts
const full = variable.compute(() => `${first.value} ${last.value}`);
```

A computed variable has `.value` and `.get()`. It has no `set()`. Calling `set()` on it throws an error, so write to the variables it reads instead.

## Reading and writing

| Call      | Does                                         |
| --------- | -------------------------------------------- |
| `.value`  | Reads or writes the value. Reading tracks it |
| `.get()`  | Reads the value. Same as `.value`            |
| `.set(v)` | Writes the value. Same as `count.value = v`  |
| `.peek()` | Reads the value without tracking it          |

```ts
const count = variable(0);
count.set(count.get() + 1);
```

## autoRun

`variable.autoRun(fn)` runs `fn` once right away. After that it runs again only when a variable or computed variable that `fn` read has updated. It tracks what it reads on every run, so a read inside an `if` counts only while that branch runs.

```ts
import { variable } from "lucia";

const count = variable(0);

function logCount() {
  console.log("count is", count.value);
}

const stop = variable.autoRun(logCount); // logs "count is 0" now
count.value++; // logs "count is 1"
stop();
```

> [!TIP]
> Use `variable.autoRun` for side effects, such as logging, saving or talking to the page. Use `variable.compute` for values you show in markup.

Three ways to run code on update:

| Form                                   | Finds what it reads     | Gets the values                     | Use it when                          |
| -------------------------------------- | ----------------------- | ----------------------------------- | ------------------------------------ |
| `variable.autoRun(fn)`                 | Yes, on every run       | You read them inside `fn`           | The list of reads may change         |
| `variable.watch([a, b], fn)`           | No, you list them       | You read them inside `fn`           | You know the exact list              |
| `count.onUpdate((now, before) => ...)` | One variable only       | `now` and `before` are passed in    | You need the old value of one variable |

## watch

`variable.watch([a, b], fn)` runs `fn` only when one of the listed variables updates. It does not track what `fn` reads, so reads inside `fn` never cause a run.

```ts
const count = variable(0);
const label = variable("cells");

const stop = variable.watch([count], () => {
  console.log("count is now", count.peek());
});
```

Pass `{ onInit: false }` to skip the first run:

```ts
variable.watch([count], () => save(count.value), { onInit: false });
```

## On one variable

`count.onUpdate(fn)` runs `fn` with the new value and the old value after each update.

```ts
const count = variable(0);

count.onUpdate((now, before) => {
  console.log(before, "to", now);
}); // logs "undefined to 0" now

count.value = 1; // logs "0 to 1"
```

At start, `before` is `undefined`. Pass `{ onInit: false }` to skip the start run.

## Options and stopping

| Form                                   | Runs at start | Pass `{ onInit: false }` |
| -------------------------------------- | ------------- | ------------------------ |
| `variable.autoRun(fn)`                 | Yes           | Not supported            |
| `variable.watch([a, b], fn)`           | Yes           | Yes                      |
| `count.onUpdate((now, before) => ...)` | Yes           | Yes                      |

Every form returns a stop function. Inside a component's `<script>`, the form also stops by itself when the component is removed.

## Types

| Type                  | Returned by                          | Can write                            |
| --------------------- | ------------------------------------ | ------------------------------------ |
| `Variable<T>`         | `variable(value)`                    | Yes, `.value = next` or `.set(next)` |
| `ComputedVariable<T>` | `variable.compute(fn)` and `props()` | No                                   |

## Behaviour

| Rule           | Detail                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| Same value     | Writing a value equal to the current one (`Object.is`) does nothing           |
| Lazy `compute` | It runs only when read, and only if an input updated                          |
| No glitches    | When several values depend on one variable, nothing sees a half-updated state |

## Sharing state

Put variables in a `.ts` file and import them anywhere. Every importer shares the same value.

```ts
// variable.ts
import { variable } from "lucia";

export const clicks = variable(0);
```

```html
<script>
  import { clicks } from "./variable.ts";
</script>

<p>{clicks} clicks</p>
```

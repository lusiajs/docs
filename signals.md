[Back to README](../README.md)

# Signals

A **signal** holds a value. Markup that reads it updates when it changes. Signals work the same in `.lucia` and plain `.ts` files.

## API

| Function | Use |
|---|---|
| `signal(value)` | Read and write with `.value` |
| `computed(() => ...)` | A value derived from other signals. Read-only, cached until its inputs change |
| `batch(() => ...)` | Make several writes. Updates run once, at the end |
| `untrack(() => ...)` | Read signals without depending on them |
| `.peek()` | On a signal or computed: read without depending on it |

```ts
import { batch, computed, signal } from "lucia";

const first = signal("Ada");
const last = signal("Lovelace");
const full = computed(() => `${first.value} ${last.value}`);

batch(() => {
  first.value = "Grace";
  last.value = "Hopper";
}); // markup that shows `full` updates once
```

## Behaviour

| Rule | Detail |
|---|---|
| Same value | Setting a value equal to the current one (`Object.is`) does nothing |
| Lazy computed | A computed runs only when read, and only if an input changed |
| No glitches | When several values depend on one signal, nothing sees a half-updated state |

## Sharing state

Put signals in a `.ts` file and import them anywhere. Every importer shares the same value.

```ts
// store.ts
import { signal } from "lucia";

export const clicks = signal(0);
```

```html
<script>
import { clicks } from "./store.ts";
</script>

<p>{clicks} clicks</p>
```

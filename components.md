[Back to README](../README.md)

# Components

A component is one `.lucia` file with up to three parts.

| Part | Required | What it is |
|---|---|---|
| `<script>` | No | TypeScript. Runs once when the file is first imported |
| Markup | No | HTML, with `{expression}` for values |
| `<style>` | No | SCSS. Scoped to this component by default. Can repeat |

## Script

`<script>` is always TypeScript. It takes no `lang` attribute.

Anything declared here can be used in the markup. Import other files the normal way.

```html
<script>
import { signal } from "lucia";
import { user } from "./store.ts";

const count = signal(0);
</script>
```

### `setup(root)`

Export a `setup` function to run code after the component is placed on the page. `root` is the element it was attached to. If `setup` returns a function, that function runs when the component is detached.

```ts
export function setup(root: Element) {
  const button = root.querySelector("button")!;
  const add = () => count.value++;
  button.addEventListener("click", add);
  return () => button.removeEventListener("click", add);
}
```

> [!NOTE]
> `setup` is a stopgap. Event syntax in markup is planned.

## Markup

Plain HTML. Put any TypeScript expression inside `{}`.

| Where | Example | Result |
|---|---|---|
| Text | `<p>Hi {name}</p>` | Text that updates |
| Whole attribute | `<button disabled={isDone}>` | See the value rules below |
| Part of an attribute | `<p class="status {kind}">` | Joined into one string |

### Value rules

| Value | In text | In a whole attribute |
|---|---|---|
| `null`, `undefined`, `false` | Empty | Attribute removed |
| `true` | `true` | Attribute set with no value (`disabled=""`) |
| Signal or computed | Its current value | Its current value |
| Anything else | `String(value)` | `String(value)` |

In a partial attribute, `null`, `undefined` and `false` become an empty string.

### What updates

An expression re-runs when a signal it reads changes.

- `{count}` reads the signal for you.
- `{count.value * 2}` reads it through `.value`.
- `{limit}` with a plain `const` never changes.

Text is inserted as text, not HTML, so values cannot inject markup.

### Braces inside expressions

Nested braces and strings work: `{ {a: 1}.a }` and `{`${n} left`}` are both fine.

## Style

`<style>` is SCSS by default. Use `lang="css"` for plain CSS. A component can have several `<style>` blocks.

```html
<style>
@use "sass:color";
$accent: tomato;

h1 { color: $accent; }
button:hover { background: color.adjust($accent, $lightness: 30%); }
</style>
```

### Modes

Plain `<style>` is tree mode. Use the attribute form or the block form to change it.

| Mode | Attribute form | Block form | Applies to |
|---|---|---|---|
| Tree (default) | `<style>` | none | This component and everything inside it, child components included |
| Scoped | `<style scoped>` | `@scoped { }` | This component's own markup. Stops at child components |
| Global | `<style global>` | `@global { }` | The whole page, unscoped |
| Inline global | none | `:global(sel)` | Only `sel` is global. Write it inside a selector |

- Tree: `h1 { color: tomato; }` also styles an h1 inside a child component.
- Scoped: `.card { padding: 1rem; }` styles `.card` in this file, but not inside a child.
- Global: `body { margin: 0; }` styles the page body.
- Inline: `.card :global(a)` scopes `.card` and leaves `a` global.

```html
<style>
h2 { color: tomato; }

@scoped {
  .card { padding: 1rem; }
}

@global {
  ::selection { background: tomato; }
}
</style>

<style global>
body { margin: 0; }
</style>
```

### Notes

| Topic | Behaviour |
|---|---|
| Specificity | Rules keep the specificity you wrote. The scope adds zero specificity |
| `@keyframes`, `@font-face` | Left unscoped |
| `@use` | Paths resolve relative to the `.lucia` file |
| `lang="css"` | Skips Sass. The rules are still scoped |
| Injection | CSS is added to the page once per component, on first attach |

## Attaching

`attach(Component, target)` puts a component into an element and returns an instance. Call `detach()` on it to remove the nodes and stop all updates.

```ts
import { attach } from "lucia";
import Counter from "./Counter.lucia";

const counter = attach(Counter, document.getElementById("slot-counter")!);
counter.detach(); // removes the nodes and stops all updates
```

See [Signals](signals.md) for state.

[Back to README](../README.md)

# Components

A component is one `.lucia` file with up to three parts.

| Part       | Required | What it is                                                                 |
| ---------- | -------- | -------------------------------------------------------------------------- |
| `<script>` | No       | TypeScript. Its imports run once per file. The rest runs once per instance |
| Markup     | No       | HTML, with `{expression}` for values                                       |
| `<style>`  | No       | SCSS. Scoped to this component by default. Can repeat                      |

## Script

`<script>` is always TypeScript. It takes no `lang` attribute.

Anything declared here can be used in the markup. Import other files the normal way.

```html
<script>
  import { variable } from "lucia";
  import { user } from "./variable.ts";

  const count = variable(0);
</script>
```

| Rule         | Detail                                                    |
| ------------ | --------------------------------------------------------- |
| Imports      | Run once per file, not once per instance                  |
| Declarations | Run once per instance. Each `attach` gets its own `count` |
| `export`     | A compile error. Move shared values to a `.ts` file       |

### `props()`

Declare the props this component accepts, with their defaults.

```html
<script>
  import { props } from "lucia";

  const { label, tone } = props({ label: "New", tone: "info" });
</script>

<span class="badge {tone}">{label}</span>
```

| Rule  | Detail                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------- |
| Value | The passed value. The default is used when nothing is passed, or the value is `null` or `undefined` |
| Type  | Each prop is a computed variable. Use it as `{label}` or `label.value`                                |
| Where | Only in the script, at top level. Calling it elsewhere throws                                       |

### `setup(root)`

Add a `function setup` to run code after the component is placed on the page. Do not use `export`. `root` is the node the component was placed in: the attach target, or the parent's node for a child component. That can be a fragment rather than an element, so use `root.querySelector(...)`. If `setup` returns a function, that function runs when the component is detached.

```ts
import { variable } from "lucia";

const count = variable(0);

function add() {
  count.value++;
}

function setup(root: Element) {
  const button = root.querySelector("button")!;
  button.addEventListener("click", add);
  function cleanup() {
    button.removeEventListener("click", add);
  }
  return cleanup;
}
```

> [!TIP]
> For clicks and other events, use `onclick={fn}` in the markup. See [Events and bind](events.md). `setup` is for code that needs the placed nodes.

## Markup

Plain HTML. Put any TypeScript expression inside `{}`.

| Where                | Example                                                           | Result                                                                  |
| -------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Text                 | `<p>Hi {name}</p>`                                                | Text that updates                                                       |
| Whole attribute      | `<button disabled={isDone}>`                                      | See the value rules below                                               |
| Part of an attribute | `<p class="status {kind}">`                                       | Joined into one string                                                  |
| Event                | `<button onclick={increment}>`                                    | Runs the function. See [Events and bind](events.md)                     |
| Two-way link         | `<input bind={name} />`                                           | Keeps the field and the variable in sync. See [Events and bind](events.md) |
| Show, repeat or skip | `<IF {loggedIn}>`, `<EACH {todos} as={todo}>`, `<FOR {i} to={5}>` | See [Flow](flow.md)                                                     |
| Animation            | `<div animate={fadeUp}>`                                          | Animates the element. See [Animate](animate.md)                         |

### Value rules

| Value                        | In text           | In a whole attribute                        |
| ---------------------------- | ----------------- | ------------------------------------------- |
| `null`, `undefined`, `false` | Empty             | Attribute removed                           |
| `true`                       | `true`            | Attribute set with no value (`disabled=""`) |
| Variable or computed variable          | Its current value | Its current value                           |
| Anything else                | `String(value)`   | `String(value)`                             |

In a partial attribute, `null`, `undefined` and `false` become an empty string.

### What updates

An expression re-runs when a variable or computed variable it reads updates.

- `{count}` reads the variable for you.
- `{count.value * 2}` reads it through `.value`.
- `{limit}` with a plain `const` never changes.

Text is inserted as text, not HTML, so values cannot inject markup.

### Braces inside expressions

Nested braces and strings work: `{ {a: 1}.a }` and `{`${n} left`}` are both fine.

### Child components

Import another `.lucia` file, then use its name as a tag. The file name does not matter, only the import name does.

```html
<script>
  import badge from "./badge.lucia";
</script>

<p>Mail: <badge label="{mailLabel}" /></p>
<p>Status: <badge label="Done" tone="warn" /></p>
```

Pass props as attributes.

| Attribute           | The child gets                                       |
| ------------------- | ---------------------------------------------------- |
| `label="Done"`      | The string `Done`                                    |
| `label={mailLabel}` | The variable's value. It updates when the variable updates |
| `flag`              | `true`                                               |
| `onclick={fn}`      | The function. The child reads it with `props()`      |

| Rule          | Detail                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Name          | The tag name must match the import name exactly, so `<Badge />` needs `import Badge`                                              |
| `bind`        | Not allowed on a component tag. Put `bind` on the field inside the child                                                          |
| Child content | Not supported yet. `<badge />` and `<badge></badge>` are fine. Anything other than whitespace between the tags is a compile error |
| Unknown tags  | Any tag without a matching import is plain HTML                                                                                   |

<<<<<<< HEAD
### Recursive components

A component can import itself. Its own tag then works inside its markup, so it can show a tree or nested replies.

```html
<script>
  import { props, variable } from "lucia";
  import Folder from "./Folder.lucia";

  const { item } = props({ item: { name: "" } });
  const children = variable.compute(() => item.value.children ?? []);
</script>

<li>
  <IF {item.value.children}>
    <span>{item.value.name}</span>
    <ul>
      <EACH {children} as={child} key={child.name}>
        <Folder item={child} />
      </EACH>
    </ul>
  </IF>
  <ELSE>
    <span>{item.value.name}</span>
  </ELSE>
</li>
```

| Rule         | Detail                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Stop         | The recursion stops when the data ends, or when an `IF` hides the tag. Without one, it goes as deep as the data |
| Depth limit  | None built in. Pass a `depth` prop and check it in an `IF`                                              |
| Keys         | Give each `EACH` row a `key` from the data. Keys must be unique among siblings                          |
| State        | Each instance has its own state                                                                         |
| Live demo    | `examples/web` Guide, Components: Recursive components                                                  |

> [!NOTE]
> A child inside a hidden `IF` branch is not created. Its own children are not created either.

### Lazy components

A component can load only when it is first shown. Declare it with `lazy(...)`, then use its name as a tag. See [Lazy components](lazy.md).

## Style

`<style>` is SCSS by default. Use `lang="css"` for plain CSS. A component can have several `<style>` blocks.

```html
<style>
  @use "sass:color";
  $accent: tomato;

  h1 {
    color: $accent;
  }
  button:hover {
    background: color.adjust($accent, $lightness: 30%);
  }
</style>
```

### Modes

Plain `<style>` is tree mode. Use the attribute form or the block form to change it.

| Mode           | Attribute form   | Block form     | Applies to                                                         |
| -------------- | ---------------- | -------------- | ------------------------------------------------------------------ |
| Tree (default) | `<style>`        | none           | This component and everything inside it, child components included |
| Scoped         | `<style scoped>` | `@scoped { }`  | This component's own markup. Stops at child components             |
| Global         | `<style global>` | `@global { }`  | The whole page, unscoped                                           |
| Inline global  | none             | `:global(sel)` | Only `sel` is global. Write it inside a selector                   |

- Tree: `h1 { color: tomato; }` also styles an h1 inside a child component.
- Scoped: `.card { padding: 1rem; }` styles `.card` in this file, but not inside a child.
- Global: `body { margin: 0; }` styles the page body.
- Inline: `.card :global(a)` scopes `.card` and leaves `a` global.

```html
<style>
  h2 {
    color: tomato;
  }

  @scoped {
    .card {
      padding: 1rem;
    }
  }

  @global {
    ::selection {
      background: tomato;
    }
  }
</style>

<style global>
  body {
    margin: 0;
  }
</style>
```

### Notes

| Topic                      | Behaviour                                                             |
| -------------------------- | --------------------------------------------------------------------- |
| Specificity                | Rules keep the specificity you wrote. The scope adds zero specificity |
| `@keyframes`, `@font-face` | Left unscoped                                                         |
| `@use`                     | Paths resolve relative to the `.lucia` file                           |
| `lang="css"`               | Skips Sass. The rules are still scoped                                |
| Injection                  | CSS is added to the page once per component, on first attach          |

## Attaching

`attach(Component, target)` puts a component into an element and returns an instance. Call `detach()` on it to remove the nodes and stop all updates.

```ts
import { attach } from "lucia";
import Counter from "./Counter.lucia";

const counter = attach(Counter, document.getElementById("slot-counter")!);
await counter.detach(); // resolves once any leave animation has finished and the nodes are removed
```

See [Variable](variable.md) for state.

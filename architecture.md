[Back to README](../README.md)

# Architecture

How a `.lucia` file becomes DOM.

```
App.lucia
   |  lucia/bun-plugin (onLoad, loader "ts")
   v
lucia/compiler:  parse  ->  style  ->  template  ->  codegen
   |
   v
TypeScript module  --imports-->  lucia/internal (runtime helpers)
```

## Compiler steps

| Step     | File                                                                                            | Output                                                                                                                                                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parse    | `parse/sections.ts`, `parse/attrs.ts`                                                           | Script, style and markup. Removed sections leave their newlines, so markup line numbers match the source                                                                                                                                           |
| Style    | `style/sass.ts`, `style/modes.ts`, `style/scope.ts`, `style/selector.ts`, `style/css-blocks.ts` | Every `<style>` is compiled with `sass` (or read as-is for `lang="css"`), then each selector gets a scope filter. The id is the FNV-1a hash of the file path (`id.ts`)                                                                             |
| Imports  | `parse/imports.ts`                                                                              | Hoists `import` lines to module level, finds default imports of `.lucia` files, and rejects `export` in the script                                                                                                                                 |
| Template | `template/scanner.ts`, `blocks.ts`, `events.ts`, `bind.ts`, `element.ts`, `checks.ts`           | Static HTML plus a list of bindings in document order. A tag named like an imported component becomes a component binding. `<IF>`, `<EACH>` and `<FOR>` read their body as a nested template. `on*` and `bind*` attributes become element bindings |
| Codegen  | `template/codegen.ts`                                                                           | The module (see [Compiled module](#compiled-module))                                                                                                                                                                                               |

Shared helpers used by more than one step live in `utils/`: `braces.ts` (skip a `{...}` expression) and `position.ts` (line and column from an index). `index.ts` wires the steps into `compile()`. `src/compiler/errors.ts` holds `LuciaError`, the error class used at compile time and at runtime.

### Source layout

| Folder                    | What it holds                                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/compiler/parse/`     | Sections and attributes of a `.lucia` file                                                                                                                     |
| `src/compiler/style/`     | Sass, scope modes, `:global()` and selector rewriting                                                                                                          |
| `src/compiler/template/`  | Markup scanner and the module generator                                                                                                                        |
| `src/compiler/utils/`     | Helpers used by two or more steps                                                                                                                              |
| `src/compiler/errors/`    | `codes.ts` (the `CODES` table), `create.ts` (`luciaError`), `where.ts` (the `file:line:column` string). See [Errors](#errors)                                  |
| `src/compiler/sourcemap/` | Position markers in the generated code, and the step that turns them into a source map. See [Source maps](#source-maps)                                        |
| `src/runtime/store/`      | `store.ts` (stores, `store.from`), `update.ts` (`store.onUpdate`) and `graph.ts` (dependency graph, grouped updates, watch)                                    |
| `src/compiler/template/`  | Also `codegen-blocks.ts` and `codegen-element.ts`, which write the binder code for blocks and elements                                                         |
| `src/runtime/dom/`        | Bindings, template cloning, injected styles, `attach`, components, `props()` and the leave list                                                                |
| `src/runtime/dom/bind/`   | `bind`, `bind-<prop>` and `bind-element`: the store-to-DOM watch and the DOM-to-store events                                                                   |
| `src/runtime/dom/blocks/` | `<IF>` (`if.ts`), `<EACH>` with keyed rows (`each.ts`), `<FOR>` over a range (`range.ts`), and the mounts and leave outlet they share                          |
| `src/runtime/animate/`    | The `animate` engine: the EASE and WHEN enums, ease modes, keyframe segments, value blending, the players and the shared frame loop. See [Animate](animate.md) |

### Scope

Scoping uses one attribute, `data-l="<id>"`. It goes only on the component's top-level elements, not on every element.

| Mode   | Selector filter added to the subject                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tree   | `:where([data-l="<id>"], [data-l="<id>"] *)`                                                                                                       |
| Scoped | Tree filter, plus `:not(:where(<child root>, <child root> *))`, where a child root is any `[data-l]` inside this component that has a different id |
| Global | None                                                                                                                                               |

- `:where()` adds zero specificity, so rules keep the specificity you wrote.
- The filter goes on the subject compound, before any pseudo-element.
- Only top-level elements carry the attribute, because stamping every element is slow to restyle.

Restyle cost against plain unscoped CSS. Measured on about 20,000 elements, Chromium 157 and Firefox 155, on 2026-11-19.

| Approach                                      | Chromium | Firefox |
| --------------------------------------------- | -------- | ------- |
| Attribute on every element                    | +99%     | +3%     |
| Native `@scope`                               | +8%      | +30%    |
| Plain root prefix (tree mode)                 | +4%      | +24%    |
| Plain prefix with `:where` stop (scoped mode) | +11%     | +21%    |

### Markers

The template step replaces each binding with a marker in the HTML. Marker names and `COMPONENT_ATTR` (`data-l`) live in `src/runtime/markers.ts` and are shared by the compiler and the runtime.

| Binding                                     | Marker                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `{expr}` in text                            | `<!--l-->` comment                                                             |
| `{expr}` in attributes                      | `data-l-bind` on the element; the dynamic attributes are removed from the HTML |
| `<child />` component tag                   | `<!--l-->` comment; the child's nodes replace it                               |
| `<IF>`, `<EACH>`, `<FOR>`                   | `<!--l-->` comment. The block inserts its rows or branches before it           |
| `animate={...}`, `on*={...}`, `bind*={...}` | `data-l-bind` on the element, like other element bindings                      |

## Compiled module

Each `.lucia` file compiles to this shape.

```ts
import { store } from "lucia";           // script imports, hoisted: run once per file
import badge from "./badge.lucia";
import { ... } from "lucia/internal";     // runtime helpers
const __css = "...";
let __template;                           // built on first render
function __render(__cleanups) {
  const count = store(0);                 // script body: runs once per instance
  const __binders = [ ... ];              // one binder per binding
  const fragment = __instantiate(__getTemplate(), __binders, __cleanups);
  return { fragment, setup };
}
export default __defineComponent(id, __css, __render);
```

| Rule                                     | Why                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| Imports stay at module level             | They run once per file, not once per instance                             |
| `export` is a compile error              | Each instance runs its own script, so exported values would not be shared |
| `setup` is read after `__render` returns | It runs once the nodes are placed                                         |

## Runtime

| Step                                   | When                        | What happens                                                                                                                                                       |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createTemplate`                       | Once per component          | Parses the HTML, sets `data-l` on each top-level element, strips the markers and records the child-index path to each one                                          |
| `defineComponent`                      | Once per component          | Returns the callable component. Its `place()` renders one instance into a parent node                                                                              |
| `instantiate`                          | Every attach                | Clones the template, finds each node by its path, runs its binder                                                                                                  |
| Binder                                 | Every attach                | Wires one node to a `watch()` that re-runs when its stores change                                                                                                  |
| `bindComponent`                        | Every render of a parent    | Places the child where its tag was and keeps the child's cleanup                                                                                                   |
| `listen`                               | Every attach                | Adds one event listener, and removes it on detach                                                                                                                  |
| `bindInput`, `bindProp`, `bindElement` | Every attach                | Two-way link for `bind`, `bind-<prop>` and `bind-element`. See [Events, bind and blocks](#events-bind-and-blocks)                                                  |
| `bindIf`, `bindEach`, `bindFor`        | Every attach                | Keeps the branch or the rows in step with their conditions and lists                                                                                               |
| `props()`                              | During a component's script | Returns one store per prop: the passed value, or the default when it is null or missing                                                                            |
| `detach()`                             | Detach                      | Runs the leave hooks first, waits for them, then runs every cleanup (stops watches, animations, child components) and removes the nodes. Returns a `Promise<void>` |

Every expression is wrapped in `unwrap()`, so a bare store shows its value.

### Leave flow

Each instance keeps a list of leave hooks. A binder adds one by taking the `leaves` argument.

```ts
type Binder = (node: Node, cleanups: Cleanup[], leaves: Leave[]) => void;
type Leave = () => Promise<void>;
```

| Step                                       | What happens                                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Animate binder                             | Adds a cleanup that cancels its players. Adds a leave hook only for `WHEN.DETACH` items                                                  |
| `detach()`                                 | `leaveThen(leaves, remove)`: with no hooks it removes the nodes at once. Otherwise it waits for `Promise.all` of the hooks, then removes |
| Child components                           | A child's leave hooks join the parent's list, so the parent waits for them                                                               |
| `<IF>` branch switch, `<EACH>` row removal | The removed branch or row runs its leave hooks, then is disposed. The block's leave hook waits for those                                 |

Without leave hooks, detach stays synchronous: no microtask delay.

## Events, bind and blocks

Each attribute and block is one binder. Binders run on the cloned fragment before it is inserted into the page, so `bind-element` is set before `setup()` runs.

### Events and bind

```html
<button onclick="{increment}">...</button> <input bind="{name}" />
```

Compiled into the element's binder:

```ts
(__node, __cleanups, __leaves) => {
  __listen(__node as Element, "click", increment, __cleanups);
  __bindInput(__node as HTMLElement, name, __cleanups);
};
```

| Rule                                                                  | Why                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| The handler is evaluated once                                         | A listener does not change, so no watch is needed                  |
| `bind` picks its property by element type                             | The element type is known at attach, so the channel is chosen once |
| Store to DOM runs in a `watch()`, DOM to store on the element's event | Equal values are never written twice, so the two sides do not loop |

### Blocks

An `<IF>` or `<EACH>` body compiles to its own render function, with its own template and binders. Each branch or row gets its own cleanups and leaves.

```ts
__bindIf(__node, [
  { test: () => __unwrap((loggedIn)), render: (__cleanups, __leaves) => __instantiate(__tpl1(), [...], __cleanups, __leaves) },
  { render: (__cleanups, __leaves) => __instantiate(__tpl2(), [...], __cleanups, __leaves) },
], __cleanups, __leaves)
```

| Block                        | Runtime                                                                                                                  | Row identity              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `<IF>`, `<ELSEIF>`, `<ELSE>` | `bindIf`: picks the first true branch in a `watch()`, and mounts it before the marker                                    | Branch index              |
| `<EACH>`                     | `bindEach`: keyed reconcile. A row with the same key and the same item object is kept. Other keys are created or removed | `key`, or the item itself |
| `<FOR>`                      | `bindFor`: an `<EACH>` over the range                                                                                    | The number                |

> [!IMPORTANT]
> The `<EACH>` index is a store. `{i}` in markup shows its value, but `key={...}` gets the index as a plain number.

## Element bindings: shape

An element with dynamic attributes gets `data-l-bind`. Its binder runs one call per attribute, event, `bind*` and `animate`:

```ts
(__node, __cleanups, __leaves) => {
  __attr(__node as Element, "title", () => __unwrap(tip), __cleanups);
  __animate(__node as HTMLElement, () => fadeUp, __cleanups, __leaves);
};
```

| Binding                                           | Call                                   |
| ------------------------------------------------- | -------------------------------------- |
| `{expr}` attribute                                | `attr`                                 |
| `on<event>={fn}`                                  | `listen`                               |
| `bind={s}`, `bind-<prop>={s}`, `bind-element={s}` | `bindInput`, `bindProp`, `bindElement` |
| `animate={...}`                                   | `animate`                              |

### Animate

```
animate={...}  -->  __animate(node, () => (expr), cleanups, leaves)   // compiled
                         |
                         v
          prepare keyframes once per element, one Player per item
                         |
          ATTACH: forward once on attach. DETACH: leave hook on detach
          VIEW / HOVER / store: shared IntersectionObserver / pointer listeners / watch()
          MANUAL: only a controller plays it
                         |
                         v
            one shared requestAnimationFrame loop for all players
```

| Rule                                         | Why                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Keyframes are read at the start of each play | A play needs fixed segments, so each play prepares its own. A new value takes effect on the next play, not mid-play |
| Only the `animate` attribute is special      | Options are fields of the value, so the compiler stays small                                                        |
| One frame loop                               | Thousands of elements share one `requestAnimationFrame` callback                                                    |

> [!IMPORTANT]
> Paths and binders are matched by index. The compiler and `createTemplate` must both walk in document order (each element before its children).

## CLI

`src/cli` is the `lucia` command. It uses the same Bun plugin as the tests and the examples.

| File                 | Job                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`           | Entry point: parses the command and runs it                                                                                 |
| `args.ts`            | Turns argv into a command, with usage errors                                                                                |
| `build.ts`           | Empties the output folder, bundles, copies `public/` and prints the file table                                              |
| `dev.ts`             | Builds in memory, watches the folder and rebuilds one at a time                                                             |
| `dev-server.ts`      | Serves the latest build, `public/` and the reload WebSocket                                                                 |
| `dev-build.ts`       | One in-memory build, with the reload client added to the HTML                                                               |
| `reload-client.ts`   | Browser script: reloads on a build, swaps changed component css in place, shows errors as an overlay                        |
| `watch.ts`           | Recursive watch with a 15 ms debounce. Skips `node_modules` and dot folders                                                 |
| `update.ts`          | Picks a css swap, a hot swap or a reload for each rebuild                                                                   |
| `hot-build.ts`       | Builds one changed `.lucia` file as its own module, served under `/__lucia/hot/`                                            |
| `runtime-module.ts`  | Builds the whole runtime once as `/__lucia/runtime.js`                                                                      |
| `runtime-shim.ts`    | Dev-only `lucia` modules that list the real export names, so a missing name still fails the build (L3001)                   |
| `timings.ts`         | Step timings and the `rebuilt in` and step table lines                                                                      |
| `log.ts`, `color.ts` | Logger. Colors only in a terminal, off with `NO_COLOR`. Category color is a pastel hue from the FNV-1a hash of the category |

Both commands call `Bun.build` on the app's `index.html`. Bun bundles the script and stylesheet tags it finds there, so the plugin runs on every `.lucia` file.

### Dev runtime and hot swap

In `lucia dev`, `lucia` and `lucia/internal` are not bundled into the app. Each page gets an import map that points them at `/__lucia/runtime.js`. The app and every hot module then share one copy of the store graph.

| Step     | What happens                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compile  | `compile(..., { dev: true })` wraps each top-level `const x = store(...)` as `__hotStore("x", store(...))`, and exports `__hotComponent(...)`. Production output has neither    |
| Register | `hotComponent` keeps the latest definition per file id. Every mounted copy is tracked by its id                                                                                 |
| Build    | `hot-build.ts` bundles the changed `.lucia` file alone. If it pulls in any file other than `.lucia` files, the update reloads, because that file would be copied and not shared |
| Send     | The server sends `{type: "hot", url}`. The page imports the module and calls `swapComponent`                                                                                    |
| Swap     | Each copy is rendered again with the new definition. Stores are restored by name, the new render goes in before the old one comes out, and a throw leaves the old copy in place |

Files in `src/runtime/dom/hot/`:

| File                                       | Job                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `define.ts`                                | `hotComponent`: the dev component, which looks up its definition by id             |
| `instance.ts`                              | One mounted copy: its region of nodes, cleanups, stores and leave hook             |
| `render.ts`                                | Runs a script and markup without inserting them, and inserts them                  |
| `store.ts`                                 | `hotStore`: registers a store by name and restores its value during a swap         |
| `swap.ts`                                  | `swapComponent` and `swapStyle`: re-renders every copy of a file                   |
| `registry.ts`, `session.ts`, `teardown.ts` | Definitions and live copies, the values waiting for new copies, and removing nodes |

## Raw imports

`import text from "./file.txt?raw"` gives the file's text as a string. It works for any file, including `.lucia` files, in builds, the dev server and `bun test`. The plugin reads the file with `Bun.file` and exports it as a string, so `.lucia` files are not compiled.

## Errors

Every error has a code from the `CODES` table in `src/compiler/errors/codes.ts`. See [Error codes](errors.md) for the list.

| Part                             | File                            | Role                                                                         |
| -------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `LuciaError`                     | `src/compiler/errors.ts`        | The error class. Holds `code`, `hint`, `file`, `line`, `column` and `length` |
| `luciaError(code, values, span)` | `src/compiler/errors/create.ts` | Fills the `$name` placeholders in the message and hint                       |
| `runtimeError(code, values)`     | `src/runtime/errors.ts`         | The same, for runtime checks. Uses the location set by `withWhere`           |
| `formatWhere` / `parseWhere`     | `src/compiler/errors/where.ts`  | Turns a location into a `file:line:column` string and back                   |

- `L1xxx` errors come from the compiler and carry a file and position.
- `L2xxx` errors come from the runtime. They have no location unless the dev build sets one.
- The dev build passes each expression's `file:line:column` to the runtime checks as a string. Production builds pass nothing, so the location is `undefined`.
- `src/runtime/errors.ts` imports with relative paths, because the runtime ships to apps where `@compiler` does not resolve.

## Source maps

The generated code keeps the `.lucia` positions as comments, and a step removes them and builds a source map.

| Step    | File                   | Role                                                                                          |
| ------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| Mark    | `sourcemap/marker.ts`  | Writes `/*@line:column*/` before each expression, and at the start of each line of the script |
| Extract | `sourcemap/extract.ts` | `extractSourceMap` strips the markers from the code and returns the code and a version 3 map  |
| VLQ     | `sourcemap/vlq.ts`     | Encodes the `mappings` field                                                                  |

- The map lists the `.lucia` file in `sources` and its text in `sourcesContent`.
- `compile()` returns `code` (markers removed) and `map` (JSON string).
- The plugin does not inline the map yet. Bun 1.4 composes an inline input map wrongly, so stack traces point at the wrong line. The map is built and tested, ready for when that is fixed.
- A production build uses the code only.

## Expr positions

`Expr` (in `src/compiler/template/types.ts`) is one `{expression}` from the markup, with where it starts.

```ts
interface Expr {
  code: string; // the expression text
  line: number; // 1-based line in the .lucia file
  column: number; // 1-based column in that line
}
```

| Used for         | How                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Attribute values | An attribute keeps its parts as `string` or `Expr`. `expressionOf` returns the `Expr` when the value is exactly one `{expr}` |
| Error location   | Compile errors use the `Expr` line and column                                                                                |
| Source maps      | `markedCode(expr)` writes the marker before `expr.code`                                                                      |
| Runtime location | `formatWhere(file, expr.line, expr.column)` in dev builds only                                                               |

## Store graph

Updates run in two phases:

1. A write marks every dependent `store.from` value dirty, synchronously, without running anything.
2. Queued watchers then run once each.

This prevents glitches when several values depend on one store (diamond-shaped graphs). `markDirty()` must never read stores.

`watch()` is internal. `store.onUpdate()` is the public way to run code on change, and it stops with its component. See [Store](store.md).

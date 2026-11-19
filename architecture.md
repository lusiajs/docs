[Back to README](../README.md)

# Architecture

How a `.lucia` file becomes DOM.

```
App.lucia
   |  @lucia/bun-plugin (onLoad, loader "ts")
   v
@lucia/compiler:  parse  ->  style  ->  template  ->  codegen
   |
   v
TypeScript module  --imports-->  lucia/internal (runtime helpers)
```

## Compiler steps

| Step | File | Output |
|---|---|---|
| Parse | `parse.ts` | Script, style and markup. Removed sections leave their newlines, so markup line numbers match the source |
| Style | `style.ts` | Every `<style>` is compiled with `sass` (or read as-is for `lang="css"`), then each selector gets a scope filter. The id is the FNV-1a hash of the file path |
| Template | `template.ts` | Static HTML plus a list of bindings in document order |
| Codegen | `codegen.ts` | The module: the script, then one binder function per binding, then the component |

### Scope

Scoping uses one attribute, `data-l="<id>"`. It goes only on the component's top-level elements, not on every element.

| Mode | Selector filter added to the subject |
|---|---|
| Tree | `:where([data-l="<id>"], [data-l="<id>"] *)` |
| Scoped | Tree filter, plus `:not(:where(<child root>, <child root> *))`, where a child root is any `[data-l]` inside this component that has a different id |
| Global | None |

- `:where()` adds zero specificity, so rules keep the specificity you wrote.
- The filter goes on the subject compound, before any pseudo-element.
- Stamping every element roughly doubled restyle time in the benchmark. See [bench/styles/RESULTS.md](../bench/styles/RESULTS.md) for why only top-level elements carry the attribute.

### Markers

The template step replaces each binding with a marker in the HTML. Marker names and `COMPONENT_ATTR` (`data-l`) live in `packages/lucia/src/markers.ts` and are shared by the compiler and the runtime.

| Binding | Marker |
|---|---|
| `{expr}` in text | `<!--l-->` comment |
| `{expr}` in attributes | `data-l-bind` on the element; the dynamic attributes are removed from the HTML |

## Runtime

| Step | When | What happens |
|---|---|---|
| `createTemplate` | Once per component | Parses the HTML, sets `data-l` on each top-level element, strips the markers and records the child-index path to each one |
| `instantiate` | Every attach | Clones the template, finds each node by its path, runs its binder |
| Binder | Every attach | Wires one node to a `watch()` that re-runs when its signals change |
| `detach()` | Detach | Runs every cleanup (stops watches) and removes the nodes |

Every expression is wrapped in `unwrap()`, so a bare signal shows its value.

> [!IMPORTANT]
> Paths and binders are matched by index. The compiler and `createTemplate` must both walk in document order (each element before its children).

## Signals

Updates run in two phases:

1. A write marks every dependent computed dirty, synchronously, without running anything.
2. Queued watchers then run once each.

This prevents glitches when several values depend on one signal (diamond-shaped graphs). `markDirty()` must never read signals.

`watch()` is internal. There is no public effect API yet.

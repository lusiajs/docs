[Back to README](../README.md)

# Lazy components

An imported component usually loads with the page. A split component loads in its own file, so the page starts smaller. The compiler picks which imports to split from the `lazy` settings in [Config](config.md). A component says what shows in its place while it downloads with a `<FALLBACK>` block.

## Modes

`lazy.mode` in `lucia.config.json` sets which components split. The default is `smart`.

| Mode    | Splits                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `smart` | A `.lucia` import whose every use sits inside `<IF>`, `<ELSEIF>`, `<ELSE>`, `<EACH>` or `<FOR>`, and that the script does not use |
| `all`   | Every imported `.lucia` file                                                                                                      |
| `off`   | Nothing. Every component loads with the page                                                                                      |

Only an import of a `.lucia` file from another `.lucia` file can split. A `.ts` import always stays with the page.

In `smart`, a component used anywhere outside a flow tag stays with the page. So does a component the script uses, such as `attach(Chart, element)`.

```html
<script>
  import { variable } from "lucia";
  import Badge from "./Badge.lucia";
  import Chart from "./Chart.lucia";

  const shown = variable(false);
</script>

<Badge label="New" />
<IF {shown}>
  <Chart />
</IF>
```

With `smart`, `Chart` loads in its own file, because every use of it sits inside an `IF`. `Badge` loads with the page, because it sits outside the flow tags.

A split component works like any other once it has loaded: props, events and `bind` behave the same.

## FALLBACK

`<FALLBACK>` is a top-level block in the `.lucia` file. It shows in the component's place while the file downloads.

```html
<!-- Chart.lucia -->
<FALLBACK>
  <p class="loading">Loading the chart...</p>
</FALLBACK>

<div class="chart">
  <p>Sales</p>
</div>

<style scoped>
  .loading {
    color: gray;
  }
</style>
```

| Rule     | Detail                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------- |
| Where    | Top level of the file. Inside an element it is error [L1038](errors.md#l1038), a second one L1039 |
| Content  | Plain elements and text only. `{expr}`, events and components are not allowed                     |
| Styles   | The file's `<style>` blocks ship with it, scoped the same way, so it keeps the component's look   |
| Optional | Yes. Without it, the place stays blank while the file downloads                                   |

> [!NOTE]
> The fallback shows before the script runs, so it has no variables. It only shows when the file is split: a component that loads with the page never shows it.

## NOLAZY

`<NOLAZY />` is a top-level marker in the `.lucia` file. It wins over every mode: that file always loads with the component that imports it.

```html
<!-- Icon.lucia -->
<NOLAZY />

<span class="icon" aria-hidden="true"></span>
```

Use it for a small component, where a second download costs more than it saves.

## When the file downloads

`lazy.prefetch` sets when a split file starts to download.

| Value            | Starts                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `idle` (default) | After the first paint, when the browser has spare time. It starts even if it never shows |
| `view`           | When its `<FALLBACK>` comes within 200px of the screen                                   |
| `none`           | Only when the component is first shown                                                   |

A file without `<FALLBACK>` has no place to watch, so `view` loads it when it is first shown.

## Chunks

| Rule          | Detail                                                                           |
| ------------- | -------------------------------------------------------------------------------- |
| One file each | A split component's code and styles go in one chunk                              |
| Shared code   | A module that two split components use is written once, in a chunk both load     |
| Reuse         | A chunk loaded for one page is reused by later pages. It is not downloaded twice |

> [!NOTE]
> `lucia build` lists each output file and its gzip size in the report, split files included.

## Errors

| Code                     | When                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| [L2057](errors.md#l2057) | A chunk fails to load. The error is reported, and the fallback stays |
| [L2059](errors.md#l2059) | `lazy()` is called. It was removed                                   |

## Dev builds

`lucia dev` serves each split component as its own file, like a build, so the behavior is the same.

## Removed: `lazy()`

Earlier versions wrapped the import in `lazy()` and took a `fallback` option. Both are gone. Import the component the normal way, and put its loading view in a `<FALLBACK>` block in that file. Calling `lazy()` throws [L2059](errors.md#l2059) and says what to do instead.

Compare with [Components](components.md) for the normal import, which loads with the page.

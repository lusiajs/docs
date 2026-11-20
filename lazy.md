[Back to README](../README.md)

# Lazy components

A lazy component loads only when it is first shown. Until then, the page does not download its code.

```html
<script>
  import { lazy, variable } from "lucia";
  import Spinner from "./Spinner.lucia";

  const shown = variable(false);
  const Chart = lazy(() => import("./Chart.lucia"), { fallback: Spinner });
</script>

<button onclick={() => (shown.value = true)} type="button">Show chart</button>
<IF {shown}>
  <Chart />
</IF>
```

## What it does

| Step               | What happens                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| First show         | The `import()` runs. The fallback shows while the file downloads              |
| Loaded             | The fallback is removed and the component takes its place                     |
| Next show          | The component is already loaded. It shows at once, with no fallback           |
| Load fails         | The error is reported as a LuciaError. The fallback stays                     |

## Parts

| Part                 | Required | What it is                                                                       |
| -------------------- | -------- | -------------------------------------------------------------------------------- |
| `() => import(path)` | Yes      | A dynamic import of a `.lucia` file. The build puts that file in its own chunk   |
| `fallback`           | No       | A component shown in its place while it loads. Without it, nothing shows         |

> [!TIP]
> Give the fallback a `label` or a spinner, so the reader knows the page is loading.

## Using the tag

Declare the lazy component at the top level of `<script>`, as `const Name = lazy(...)`. Then use `<Name />` in the markup, the same way as an imported component.

| Rule         | Detail                                                                                 |
| ------------ | -------------------------------------------------------------------------------------- |
| Position     | Only at the top level of `<script>`. A `lazy(...)` inside a function is not a tag      |
| Props        | Passed like any component: `<Chart title="Sales" />`                                   |
| Attach       | Works with `attach(Chart, element)` too                                                |

## Chunks

`lazy` uses a dynamic import, so the bundler writes each lazy component to its own chunk file.

| Rule                          | Detail                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| One chunk per lazy component  | A component's own code and its styles are in one file                                       |
| Shared code                   | A module that two lazy parts use is written once, in a chunk both load                      |
| Reuse across pages            | A chunk loaded for one page is reused by later pages. It is not downloaded twice            |

> [!NOTE]
> The build measures the chunks. `lucia build` lists each file and its gzip size in the report.

## Errors

If the file cannot load, the error is reported as a LuciaError, with code [L2057](errors.md#l2057). The page keeps the fallback, so the rest of the page still works.

## Dev builds

In `lucia dev`, a lazy component is served as its own file, like a build.

Compare with [Components](components.md) for the normal import, which is loaded with the page.

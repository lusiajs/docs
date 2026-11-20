[Back to README](../README.md)

# Development

## Commands

| Task                                                                      | Command                                      |
| ------------------------------------------------------------------------- | -------------------------------------------- |
| Install                                                                   | `bun install`                                |
| Web example                                                               | `bun run dev` (port 3000)                    |
| Stress example                                                            | `bun run dev:stress` (port 3000)             |
| Build the web example                                                     | `bun run build` (writes `dist/`)             |
| Write the playground runtime only                                         | `bun scripts/playground-runtime.ts`          |
| All tests                                                                 | `bun test`                                   |
| One test file                                                             | `bun test test/compiler/style/modes.test.ts` |
| Tests by name                                                             | `bun test -t "diamond"`                      |
| Typecheck                                                                 | `bun run typecheck`                          |
| Format all files                                                          | `bun run format`                             |
| Check formatting without writing                                          | `bun run format:check`                       |
| Everything before a commit: typecheck, tests, site build, extension build | `bun run check`                              |

> [!NOTE]
> The dev server rebuilds on each save. Style changes and component changes update the page without a reload. Other changes reload the browser. Build errors show in the page and in the terminal.

## CLI

The `lucia` command builds and serves an app folder. An app folder has an `index.html` that points to its entry with a module script:

```html
<script type="module" src="./src/main.ts"></script>
```

Any stylesheets go in `<link>` tags. An optional `public/` folder is copied as it is.

| Command             | What it does                                           |
| ------------------- | ------------------------------------------------------ |
| `lucia build [dir]` | Bundles the app into `dist/` and prints the file sizes |
| `lucia dev [dir]`   | Serves the app with live reload                        |

| Option             | Command | Default           | Effect                                                                                       |
| ------------------ | ------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `dir`              | both    | `.`               | The app folder                                                                               |
| `--outdir <path>`  | build   | `dist`            | Output folder, relative to where you run the command. It is emptied first                    |
| `--no-minify`      | build   | minified          | Keep the bundle readable                                                                     |
| `--port <n>`       | dev     | `3000`, or `PORT` | Port for the dev server. `0` picks a free port                                               |
| `--routes <paths>` | build   | none              | Comma-separated client routes, such as `/guide,/reference`. Each gets a copy of `index.html` |
| `--quiet`          | both    | off               | Hides the timing output. Errors still show                                                   |

Run it with Bun: `bun src/cli/index.ts build examples/web`. The [playground](playground.md) needs `public/playground/lucia.js`. `bun run build` and `bun run dev` write it first, so run `bun scripts/playground-runtime.ts` before using the command above.

### Timing output

`lucia build` prints a table of where the time went, before the file sizes:

```text
Step           Time
-------------------
compile       23 ms
sass         216 ms
bundle        10 ms
write        7.9 ms
copy public  0.1 ms
-------------------
total        258 ms
```

`lucia dev` prints one line per rebuild, then one line when the browser reports back:

```text
rebuilt in 11 ms  wait 15 · sass 2.3 · compile 0.5 · bundle 8.1 · send 0.1  (css swap)
browser ready in 0.5 ms
```

| Step                       | Meaning                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| `wait`                     | Time from the first file change to the start of the rebuild         |
| `sass`                     | Time in the Sass compiler. Zero when the styles came from the cache |
| `compile`                  | Time in the `.lucia` compiler, without Sass                         |
| `bundle`                   | Bun's own work: linking and the rest of the bundle                  |
| `send`                     | Time to send the update to the browser                              |
| `write`                    | Time to write the files to the output folder (build only)           |
| `copy`                     | Time to copy `public/` (build only)                                 |
| `(reload)` or `(css swap)` | What the browser did with the update                                |
| `browser ready`            | Time from the update to the page's `load` event                     |

Use `--quiet` to hide these lines.

### Dev update rules

| Change                                                  | What the browser does                     |
| ------------------------------------------------------- | ----------------------------------------- |
| A `<style>` block in a `.lucia` file                    | Swaps its css, no reload                  |
| A `.scss` or `.sass` partial that a style imports       | Swaps the css, no reload                  |
| A script or markup change in a `.lucia` file            | Swaps the component in place (hot update) |
| A `.lucia` file that imports a `.ts` file or a package  | Reloads                                   |
| A `.ts` file, `index.html`, `public/` or any other file | Reloads                                   |
| Any change right after a build error                    | Reloads                                   |

A css swap replaces the text of the component's `<style data-lucia="...">` element. If that component is not on the page yet, the page reloads.

### Hot updates

A hot update re-renders each mounted copy of the edited component, in the same place, with the same props.

| Kept                                                                                 | Lost                                                                        |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Position, props and child slots                                                      | DOM state inside the component, such as focus and input text                |
| Variables declared at the top of the script (`const count = variable(0)`), matched by name | Variables whose name is new start from their first value                       |
| `variable.compute` values (they run again)                                                 | Effects from `variable.autoRun` of the old copy (they stop; the new ones run) |

- Leave and attach animations are skipped on a hot update.
- If the new script or markup throws, the old copy stays and an overlay shows the error. The next good edit swaps.
- A component that uses another component is re-created with it. Each child keeps its variables by name too.
- Only top-level `variable(...)` declarations keep their value. A variable made inside a function or an `if` starts fresh.

### Dynamic imports

`import()` in the app creates a separate chunk file, loaded when the code runs. `lucia build` writes it to the output folder, and `lucia dev` serves it. For components, see [Lazy components](lazy.md).

## Client routes

Apps with client-side routes (history API) need a server that answers deep links with `index.html`.

| Where                         | What happens                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| `lucia dev`                   | A GET for a path with no file extension gets `index.html`. Files and `public/` still win      |
| `lucia build --routes /guide` | Writes `dist/guide/index.html`, a copy of `index.html`, so a static host serves the deep link |

> [!NOTE]
> Each route must start with `/` and cannot contain `..`.

## Browser tests

Most tests run in a fake DOM (happy-dom). The scope tests in `test/compiler/style/scope.browser.test.ts` run in real Chromium through Playwright.

| Setup                     | How                                         |
| ------------------------- | ------------------------------------------- |
| Use Playwright's Chromium | `bunx playwright install chromium`          |
| Use your own Chromium     | `LUCIA_CHROMIUM=/path/to/chromium bun test` |

If Chromium cannot start, those tests are skipped and the test name says why.

## Errors

Error codes live in `src/compiler/errors/codes.ts`. Each code has a message and a hint. See [Error codes](errors.md) for the list.

To add a code:

1. Add one entry to `CODES` in `codes.ts`. Use `L1xxx` for compile errors and `L2xxx` for runtime errors.
2. Raise it with `luciaError` (compiler) or `runtimeError` (runtime), and pass a value for each `$name` placeholder.
3. Add a `## L....` section for it in [docs/errors.md](errors.md).

## Layout

| Path                                                           | What it holds                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/runtime`                                                  | The runtime: variables and DOM helpers                                                              |
| `src/compiler`                                                 | The `.lucia` compiler                                                                            |
| `src/bun-plugin`                                               | The Bun loader for `.lucia` files and `?raw` imports                                             |
| `src/cli`                                                      | The `lucia` command: `build` and `dev`                                                           |
| `test/runtime`, `test/compiler`, `test/bun-plugin`, `test/cli` | Tests. Each folder mirrors its `src/` folder                                                     |
| `examples/web`                                                 | A docs-style page: every feature with live demos and source                                      |
| `examples/web/src/App.lucia`                                   | A minimal starter component: variable, `bind` and flow in one file                                  |
| `examples/web/src/playground`                                  | The [playground](playground.md) page: file list and live run                                     |
| `examples/web/src/live`                                        | The shared browser build and preview frame, used by the playground and the Guide demos. See [editor.md](editor.md#live-demos) |
| `examples/web/public/playground`                               | The preview frame (`frame.html`, `frame.js`). `lucia.js` is generated, not committed             |
| `scripts`                                                      | Build helpers, such as `playground-runtime.ts`, which writes the preview runtime                 |
| `examples/stress`                                              | Scenarios that push the limits and report timings                                                |
| `editors/vscode`                                               | The VS Code extension: `.lucia` grammar, snippets and language settings. See [Editor](editor.md) |
| `test/setup.ts`                                                | Preloaded by `bun test`: sets up a fake DOM (happy-dom) and the `.lucia` loader                  |
| `lucia.d.ts`                                                   | Type declaration so TypeScript accepts `import App from "./App.lucia"`                           |

## Import paths

| Import                                        | Resolves to                           | Use it for                        |
| --------------------------------------------- | ------------------------------------- | --------------------------------- |
| `@runtime/*`                                  | `src/runtime/*`                       | Runtime files, from another area  |
| `@compiler/*`                                 | `src/compiler/*`                      | Compiler files, from another area |
| `@bun-plugin/*`                               | `src/bun-plugin/*`                    | Plugin files, from another area   |
| `@cli/*`                                      | `src/cli/*`                           | CLI files, from another area      |
| `lucia`, `lucia/compiler`, `lucia/bun-plugin` | The package exports in `package.json` | Examples and tests                |

Imports inside one area stay relative, for example `../utils/braces.ts`.

## Tests

Tests live in `test/`, one folder per area. Each folder mirrors its `src/` folder, so `src/compiler/style/modes.ts` is tested in `test/compiler/style/modes.test.ts`. The plugin tests attach the web example's `Events` demo, so update them when it changes.

## Stress scenarios

Each folder under `examples/stress` is one scenario. Open `http://localhost:3000` after `bun run dev:stress` to see all the results in one table.

1. Create a folder, for example `examples/stress/my-case/`.
2. Add `main.ts` that exports `run(): Promise<Result[]>` (type `Result` is in `examples/stress/report.ts`).
3. Add `my-case.test.ts` next to it to check the behaviour.
4. Add one line in `examples/stress/scenarios.ts`, for example `import * as myCase from "./my-case/main.ts";` and then add `myCase.run` to the `scenarios` array.

See [Architecture](architecture.md) for how the pieces fit together.

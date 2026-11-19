[Back to README](../README.md)

# Development

## Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Web example | `bun run dev` (port 3000) |
| Stress example | `bun run dev:stress` (port 3000) |
| Build the web example | `bun run build` (writes `dist/`) |
| All tests | `bun test` |
| One test file | `bun test test/compiler/style/modes.test.ts` |
| Tests by name | `bun test -t "diamond"` |
| Typecheck | `bun run typecheck` |

> [!NOTE]
> The dev server rebuilds on each save and reloads the browser. Build errors show in the page and in the terminal.

## CLI

The `lucia` command builds and serves an app folder. An app folder has an `index.html` that points to its entry with a module script:

```html
<script type="module" src="./src/main.ts"></script>
```

Any stylesheets go in `<link>` tags. An optional `public/` folder is copied as it is.

| Command | What it does |
|---|---|
| `lucia build [dir]` | Bundles the app into `dist/` and prints the file sizes |
| `lucia dev [dir]` | Serves the app with live reload |

| Option | Command | Default | Effect |
|---|---|---|---|
| `dir` | both | `.` | The app folder |
| `--outdir <path>` | build | `dist` | Output folder, relative to where you run the command. It is emptied first |
| `--no-minify` | build | minified | Keep the bundle readable |
| `--port <n>` | dev | `3000`, or `PORT` | Port for the dev server. `0` picks a free port |
| `--routes <paths>` | build | none | Comma-separated client routes, such as `/guide,/reference`. Each gets a copy of `index.html` |

Run it with Bun: `bun src/cli/index.ts build examples/web`.

## Client routes

Apps with client-side routes (history API) need a server that answers deep links with `index.html`.

| Where | What happens |
|---|---|
| `lucia dev` | A GET for a path with no file extension gets `index.html`. Files and `public/` still win |
| `lucia build --routes /guide` | Writes `dist/guide/index.html`, a copy of `index.html`, so a static host serves the deep link |

> [!NOTE]
> Each route must start with `/` and cannot contain `..`.

## Browser tests

Most tests run in a fake DOM (happy-dom). The scope tests in `test/compiler/style/scope.browser.test.ts` run in real Chromium through Playwright.

| Setup | How |
|---|---|
| Use Playwright's Chromium | `bunx playwright install chromium` |
| Use your own Chromium | `LUCIA_CHROMIUM=/path/to/chromium bun test` |

If Chromium cannot start, those tests are skipped and the test name says why.

## Errors

Error codes live in `src/compiler/errors/codes.ts`. Each code has a message and a hint. See [Error codes](errors.md) for the list.

To add a code:

1. Add one entry to `CODES` in `codes.ts`. Use `L1xxx` for compile errors and `L2xxx` for runtime errors.
2. Raise it with `luciaError` (compiler) or `runtimeError` (runtime), and pass a value for each `$name` placeholder.
3. Add a `## L....` section for it in [docs/errors.md](errors.md).

## Layout

| Path | What it holds |
|---|---|
| `src/runtime` | The runtime: stores and DOM helpers |
| `src/compiler` | The `.lucia` compiler |
| `src/bun-plugin` | The Bun loader for `.lucia` files and `?raw` imports |
| `src/cli` | The `lucia` command: `build` and `dev` |
| `test/runtime`, `test/compiler`, `test/bun-plugin`, `test/cli` | Tests. Each folder mirrors its `src/` folder |
| `examples/web` | A docs-style page: every feature with live demos and source |
| `examples/stress` | Scenarios that push the limits and report timings |
| `editors/vscode` | The VS Code extension: `.lucia` grammar, snippets and language settings. See [Editor](editor.md) |
| `test/setup.ts` | Preloaded by `bun test`: sets up a fake DOM (happy-dom) and the `.lucia` loader |
| `lucia.d.ts` | Type declaration so TypeScript accepts `import App from "./App.lucia"` |

## Import paths

| Import | Resolves to | Use it for |
|---|---|---|
| `@runtime/*` | `src/runtime/*` | Runtime files, from another area |
| `@compiler/*` | `src/compiler/*` | Compiler files, from another area |
| `@bun-plugin/*` | `src/bun-plugin/*` | Plugin files, from another area |
| `@cli/*` | `src/cli/*` | CLI files, from another area |
| `lucia`, `lucia/compiler`, `lucia/bun-plugin` | The package exports in `package.json` | Examples and tests |

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

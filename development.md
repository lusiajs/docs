[Back to README](../README.md)

# Development

## Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Web example | `bun dev` (port 3000; set `PORT` to change it) |
| Stress example | `bun dev:stress` (port 3000) |
| All tests | `bun test` |
| One test file | `bun test packages/compiler/test/style/modes.test.ts` |
| Tests by name | `bun test -t "diamond"` |
| Typecheck | `bun run typecheck` |

> [!NOTE]
> `bun dev` rebuilds `.lucia` files on each page load, so refresh the browser after editing them. After editing the compiler or runtime, restart `bun dev`.

## Browser tests

Most tests run in a fake DOM (happy-dom). The scope tests in `packages/compiler/test/style/scope.browser.test.ts` run in real Chromium through Playwright.

| Setup | How |
|---|---|
| Use Playwright's Chromium | `bunx playwright install chromium` |
| Use your own Chromium | `LUCIA_CHROMIUM=/path/to/chromium bun test` |

If Chromium cannot start, those tests are skipped and the test name says why.

## Layout

| Path | What it holds |
|---|---|
| `packages/lucia` | The runtime: signals and DOM helpers |
| `packages/compiler` | The `.lucia` compiler |
| `packages/bun-plugin` | The Bun loader for `.lucia` files |
| `examples/serve.ts` | Serves one example: `bun examples/serve.ts <name>` |
| `examples/web` | A landing page that shows every feature |
| `examples/stress` | Scenarios that push the limits and report timings |
| `test/setup.ts` | Preloaded by `bun test`: sets up a fake DOM (happy-dom) and the `.lucia` loader |
| `lucia.d.ts` | Type declaration so TypeScript accepts `import App from "./App.lucia"` |

Bun uses its isolated linker here. The root `package.json` must list every workspace package that the tests import.

## Tests

Each package keeps its tests in `test/`. Test folders mirror the source folders, so `src/style/modes.ts` is tested in `test/style/modes.test.ts`. The plugin tests attach the real web `Counter`, so update them when it changes.

## Stress scenarios

Each folder under `examples/stress` is one scenario. Open `http://localhost:3000` after `bun dev:stress` to see all the results in one table.

1. Create a folder, for example `examples/stress/my-case/`.
2. Add `main.ts` that exports `run(): Promise<Result[]>` (type `Result` is in `examples/stress/report.ts`).
3. Add `my-case.test.ts` next to it to check the behaviour.
4. Add one line in `examples/stress/scenarios.ts`, for example `import * as myCase from "./my-case/main.ts";` and then add `myCase.run` to the `scenarios` array.

See [Architecture](architecture.md) for how the pieces fit together.

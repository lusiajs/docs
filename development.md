[Back to README](../README.md)

# Development

## Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Example app | `bun dev` (port 3000; set `PORT` to change it) |
| All tests | `bun test` |
| One test file | `bun test packages/compiler/test/style.test.ts` |
| Tests by name | `bun test -t "diamond"` |
| Typecheck | `bun run typecheck` |

> [!NOTE]
> `bun dev` rebuilds `.lucia` files on each page load, so refresh the browser after editing them. After editing the compiler or runtime, restart `bun dev`.

## Layout

| Path | What it holds |
|---|---|
| `packages/lucia` | The runtime: signals and DOM helpers |
| `packages/compiler` | The `.lucia` compiler |
| `packages/bun-plugin` | The Bun loader for `.lucia` files |
| `examples/basic` | The demo app |
| `test/setup.ts` | Preloaded by `bun test`: sets up a fake DOM (happy-dom) and the `.lucia` loader |
| `lucia.d.ts` | Type declaration so TypeScript accepts `import App from "./App.lucia"` |

Bun uses its isolated linker here. The root `package.json` must list every workspace package that the tests import.

## Tests

Each package keeps its tests in `test/`. The plugin tests mount the real demo app, so update them when the demo changes.

See [Architecture](architecture.md) for how the pieces fit together.

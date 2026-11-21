<p align="center"><img src="public/logo.svg" width="96" alt="Lusia logo"></p>

# Lusia docs

The source of the docs site at https://lusia.azpepoze.com. It has the guide, the API reference, the error list and a playground.

Built with [Lusia](https://github.com/lusiajs/lusia) from the `lusiajs` npm package.

## Dev

Needs [Bun](https://bun.sh) 1.4 or newer.

```sh
bun install
bun run dev
```

| Command | What it does |
| ------- | ------------ |
| `bun run dev` | Starts the dev server |
| `bun run build` | Builds the site into `dist/` |
| `bun test` | Runs the tests |
| `bun run typecheck` | Checks the types |
| `bun run check` | Typecheck, tests and build |

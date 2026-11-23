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

## For AI tools

The site serves the docs as plain text and Markdown for AI tools.

| File | What it is |
| ---- | ---------- |
| `/llms.txt` | Short index with links to every page |
| `/llms-full.txt` | All pages in one file |
| `/docs/` | One Markdown page per API entry, error codes and config |

The files are generated into `public/` by `scripts/ai-docs.ts` on every `dev` and `build`.

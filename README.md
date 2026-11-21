<p align="center"><img src="public/logo.svg" width="96" alt="Lusia logo"></p>

# Lusia docs

The source of the Lusia docs site. It shows the guide, the API reference, the error list and an online playground.

> [!NOTE]
> The site is built with [Lusia](https://github.com/lusiajs/lusia) itself, from the `lusiajs` npm package.

Read the guide: https://lusia.azpepoze.com/guide

## Quick start

Requires [Bun](https://bun.sh) 1.4 or newer.

```sh
bun install
bun run dev
```

Open the local address that Bun prints.

## Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Writes the playground runtime, then starts the dev server. |
| `bun run build` | Writes the playground runtime, then builds the site into `dist/`. |
| `bun test` | Runs the unit and browser tests. |
| `bun run typecheck` | Checks the types with TypeScript. |
| `bun run check` | Runs typecheck, tests and build in order. |

## Deploy

Every push to `main` builds the site and publishes `dist/` to GitHub Pages. See `.github/workflows/deploy.yml`.

## Updating

The site uses the published `lusiajs` package. Updates happen on their own:

| Case | What happens |
| --- | --- |
| New `lusiajs` release | The site updates within 6 hours. |
| Want it now | Run **Update lusiajs** from the Actions tab. |
| Update fails the tests or the build | The workflow fails and nothing is pushed. A person must fix the docs. |

See `.github/workflows/update-framework.yml`.

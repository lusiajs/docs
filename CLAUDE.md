# CLAUDE.md

This repo is the docs site of Lusia (lusiajs/docs), served at https://lusia.azpepoze.com. It uses the published `lusiajs` npm package.

# 1. Framework changes come by release

The site imports `lusiajs/api`, `lusiajs/language/*`, `lusiajs/editor/*`, `lusiajs/errors/*` and `lusiajs/compiler/*`. A framework change reaches the site only after a release. The update workflow then bumps the version (see rule 10).

# 2. Guide is a learning path

Order groups and entries simplest first. A beginner meets each idea before anything that uses it.

# 3. Every feature has a live demo

Each feature shows a live demo with its source code.

# 4. Simple English names

Public names use plain words: `variable`, not `signal`. Use `update`, never `change`. Reuse existing words for new options.

# 5. Markup syntax is designed by the user

Never invent new `.lusia` syntax. Copy the patterns from existing components and Guide pages.

# 6. Docs use plain text

No emoji in docs, pages or READMEs. Keep sentences short. Use tables where they help.

# 7. Commands

`bun run dev`, `bun test`, `bun run typecheck`, `bun run build`, `bun run check`.

# 8. Check before reporting done

Run `bun run check` and make sure it passes.

# 9. Commits

Use Conventional Commits. One commit per logical change.

# 10. Framework updates are automatic

Every 6 hours `.github/workflows/update-framework.yml` runs `bun update lusiajs`. If the version changed, it runs typecheck, test and build, then pushes to `main` and deploys. If a check fails, nothing is pushed and a person must fix the docs.

# 11. Indent script and style

Indent the code inside `<script>` and `<style>` by 2 spaces, in `.lusia` files and in every code example shown on the site. The framework allows flush-left code, but this is the house style.

```lusia
<script>
  import { variable } from "lusiajs";

  const count = variable(0);
</script>

<p>{count}</p>

<style scoped>
  p {
    color: tomato;
  }
</style>
```

# 12. Branches

Work from `main`. Only `main` and `dev` stay long-lived. Delete a branch once it is merged.

# 13. Worktrees

Worktrees go in `.worktrees/` inside this repo (gitignored): `git worktree add .worktrees/<name> -b <branch> dev`. Never put them next to the repo or in `/tmp`.

# 14. Reuse before writing

Before writing logic, search the repo for code that already does the same job (a check, a cache, a parser, a helper). Reuse or extend it. When two places need the same thing, make one shared helper or base interface and have both use it. Never write a second version. Every agent spec includes this check.

# 15. Use the framework first

Build with Lusia's own features (animate, EVENT, listen, lazy, variable) before writing plain DOM or browser code. If a feature is missing or needs a workaround, tell the user when done.

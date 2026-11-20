[Back to README](../README.md)

# Editor support

The VS Code extension lives in `editors/vscode`. It gives `.lucia` files colours, completion, hover, errors, warnings, navigation and formatting.

## Features

| Feature          | Source                                          |
| ---------------- | ----------------------------------------------- |
| Colours          | `syntaxes/lucia.tmLanguage.json`                |
| Completion       | `src/logic/completions.ts`                      |
| Hover            | `src/logic/hover.ts`, `src/logic/markdown.ts`   |
| Errors           | `src/diagnostics.ts`, the real compiler         |
| Warnings (lint)  | `src/logic/lint.ts` and `src/logic/lint/rules/` |
| Go to definition | `src/providers/definition.ts`                   |
| Format           | `src/logic/format.ts`                           |
| API docs         | `reference/api.ts`, shared with `examples/web`  |

## Completion

| Where                                   | Offers                                                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<script>`                              | Lucia API names, with `import` added to the `lucia` import, and a `props({ ... })` snippet                                                                   |
| Markup, after `<`                       | Default imports of `.lucia` files, with `/>`. Also the flow tags `IF`, `ELSEIF`, `ELSE`, `EACH` and `FOR`, as snippets                                       |
| In an `<EACH>` tag                      | `as=`, `index=`, `key=`                                                                                                                                      |
| In a `<FOR>` tag                        | `from=`, `to=`, `step=`                                                                                                                                      |
| On a component tag                      | Prop names from the child's `props({ ... })`                                                                                                                 |
| On a plain tag                          | `animate={...}`, the events (`onclick`, `oninput`, ...) and `bind-element`. On `input`, `textarea` and `select` also `bind`, `bind-value` and `bind-checked` |
| On `<style`                             | `scoped`, `global`, `lang="css"`                                                                                                                             |
| In a style body                         | `@scoped`, `@global`, `:global()`                                                                                                                            |
| After `EASE.`, `EASE.STYLE.` or `WHEN.` | The enum's members, with the enum imported                                                                                                                   |
| Inside `animate={...}`                  | The keys of an item object (`style`, `when`, `once`, ...). After `when:`, the `WHEN` enum                                                                    |

> [!NOTE]
> Keys of an item object are offered where an object can start a new item. Keyframes objects (keys that are numbers) are skipped.

Enum members are listed in the `members` field of the entry in `reference/api.ts`.

## Warnings

Warnings use the source `lucia-lint`. They never block a build.

| Code                        | Warns when                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `unused-import`             | A `.lucia` import is never used as a tag                                                                       |
| `props-twice`               | `props()` is called more than once in a script                                                                 |
| `unknown-prop`              | A component tag passes a prop its `props({ ... })` does not declare                                            |
| `empty-expression`          | Markup has `{}`                                                                                                |
| `style-attribute`           | A `<style>` tag has an attribute other than `scoped`, `global` or `lang`                                       |
| `animate-keyframes` (error) | An `animate` attribute on a plain tag is not `{expr}`. Matches the compiler's error                            |
| `flow-chain` (error)        | `<ELSE>` or `<ELSEIF>` is not right after `</IF>` or `</ELSEIF>`. Matches the compiler's error                 |
| `bind-target` (error)       | `bind` is on a tag other than `input`, `textarea` or `select`, or on a component. Matches the compiler's error |

> [!NOTE]
> `unknown-prop` needs the child file on disk. It does not warn when the child cannot be read.

## Format

Formatting uses Prettier. It works on the whole file.

| Part       | Formatter                                   |
| ---------- | ------------------------------------------- |
| `<script>` | Prettier, TypeScript                        |
| `<style>`  | Prettier, SCSS, or CSS with `lang="css"`    |
| Markup     | Prettier, HTML. `{expr}` is kept as written |

Sections keep their order, with one blank line between sections.

> [!WARNING]
> Expressions inside `{...}` are not reformatted. Prettier only sees the placeholders.

Flow tags such as `<IF {ok}>` and `</EACH>` are kept exactly as written, like `{...}`. Their uppercase names and attributes stay the same. Prettier may put them on the same line as the next tag, which is still valid.

## Add an API entry

The API table is `reference/api.ts`. Completion, hover and the web docs all read it.

1. Add an `ApiEntry` to `api` in `reference/api.ts`. Use the fields `id`, `name`, `kind`, `group`, `signature`, `summary`, `bullets` (3 to 5) and `example`. An enum object also takes `members`.
2. Run `bun test test/editors`. The test checks ids, kinds, groups and bullet counts.
3. Update the API table in `examples/web` in the same change.

| Field     | Value                                                               |
| --------- | ------------------------------------------------------------------- |
| `kind`    | `function`, `type`, `markup`, `style` or `value`                    |
| `group`   | `basics`, `reactivity`, `flow`, `components`, `styling` or `motion` |
| `name`    | The label shown, for example `store()`                              |
| `members` | Enum objects only: `{ name, summary }` for each member              |

A `function`, `type` or `value` entry named like a `lucia` export is offered in `<script>` with an auto-import. A `value` is a constant, such as an enum object.

## Keep the grammar current

The grammar is `editors/vscode/syntaxes/lucia.tmLanguage.json`. Update it in the same change when the `.lucia` format changes.

| Change                      | Also update                                          |
| --------------------------- | ---------------------------------------------------- |
| New section or attribute    | The `<script>` and `<style>` rules in the grammar    |
| New block keyword in styles | `style-at-rules` in the grammar                      |
| New markup syntax           | The `expression` rule and the `L:meta.tag` injection |
| New snippet                 | `editors/vscode/snippets/lucia.json`                 |

## Tests

| Command                               | Checks                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `bun test test/editors`               | Grammar, real token scopes, completion, hover, format, lint, API table |
| `cd editors/vscode && bun run build`  | The extension bundles                                                  |
| `bunx tsc --noEmit -p editors/vscode` | The extension type checks                                              |

## Web editor

The docs site has a code editor component, `examples/web/src/components/CodeEditor.lucia`. It runs the same checks as the VS Code extension, in the browser. It is built on [CodeMirror 6](https://codemirror.net/).

### Props

| Prop       | Type                   | Default | What it does                                            |
| ---------- | ---------------------- | ------- | ------------------------------------------------------- |
| `files`    | `{ name, code }[]`     | `[]`    | The files to show. Two or more files add tabs           |
| `active`   | string                 | `""`    | The file to show first                                  |
| `readOnly` | boolean                | `false` | Blocks typing and formatting                            |
| `onChange` | `(name, code) => void` | no-op   | Called after each edit, with the file name and its code |

```html
<CodeEditor files="{sources}" active="App.lucia" onChange="{save}" />
```

> [!TIP]
> To keep the code, store it in the `onChange` handler. The editor does not write to the `files` store.

### What it does

| Feature    | Detail                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Colours    | `.lucia` and `.ts`. Light and dark mode use the site's `--tok-*` colours                                                                 |
| Completion | Lucia API names with imports, enums, `animate` keys, CSS properties, flow tags, HTML tags, names in the file, and `.value` and `.peek()` |
| Docs popup | The signature and description from `reference/api.ts`, for completions and hover                                                         |
| Errors     | Compile errors with code, message and hint, plus TypeScript syntax errors in the script                                                  |
| Warnings   | The lint rules in [Warnings](#warnings)                                                                                                  |
| Format     | Shift+Alt+F, or the format button. Same rules as the extension's [Format](#format)                                                       |
| Editing    | Line numbers, bracket matching, auto-close, auto-indent, multiple cursors, search and replace, undo and redo, folding, active line       |
| Copy       | The copy button copies the file that is shown                                                                                            |

> [!NOTE]
> Errors and warnings appear about 300 ms after you stop typing. Style errors are not checked in the browser, because Sass does not run there.

### Keys

| Key            | Action                                         |
| -------------- | ---------------------------------------------- |
| Tab            | Indents the line or selection                  |
| Arrow keys     | In the list of tabs, moves between files       |
| Esc            | Leaves the editor, so the keyboard can move on |
| Shift+Alt+F    | Formats the file                               |
| Ctrl+F         | Search. The panel also has a replace field     |
| Ctrl+Z, Ctrl+Y | Undo and redo                                  |

On a phone the code text is 16px, so it does not zoom when tapped, and long lines wrap.

### Loading

The editor code loads when the component is placed on the page. Prettier loads the first time a file is formatted.

| Part     | Loads when              | Size (gzipped) |
| -------- | ----------------------- | -------------- |
| Editor   | The component is placed | About 240 KB   |
| Prettier | The first format        | About 400 KB   |

### Tests

| Command                         | Checks                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `bun test test/examples/editor` | Completions, diagnostics and their positions, format, docs and highlight marks |

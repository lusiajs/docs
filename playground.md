[Back to README](../README.md)

# Playground

The playground is a page on the docs site, at `/playground`. Edit the files on the left. The preview on the right updates a moment after you stop typing.

## Layout

| Part         | What it does                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Toolbar      | Auto run on or off, Run (shown when auto run is off), Format and Reset                                         |
| File buttons | New file, Rename and Delete. `App.lucia` is the entry file, so it cannot be renamed or deleted                 |
| Editor       | The [web editor](editor.md#web-editor). Tabs appear when there are two or more files                           |
| Preview      | The app, running in a sandbox                                                                                  |
| Errors       | Each problem with its code, message and hint. Click the location, such as `App.lucia:4:40`, to move the cursor |

On a phone the editor sits above the preview.

## File names

| Rule                                                 | Example                           |
| ---------------------------------------------------- | --------------------------------- |
| Letters, digits, `-` and `_`, then `.lucia` or `.ts` | `Card.lucia`, `store-utils.ts`    |
| Starts with a letter                                 | `Card.lucia`, not `1st.lucia`     |
| No folders: every file sits in one list              | `Card.lucia`, not `ui/Card.lucia` |

Import a file by its full name: `import Card from "./Card.lucia";`. Only `lucia` and the playground files can be imported.

## How a run works

```text
files -> compile each .lucia -> remove TypeScript -> link imports
      -> send the runtime and modules to a sandbox -> attach App.lucia
```

- A run starts 300 ms after the last change.
- Each run loads in a new frame. The new frame replaces the old one only after it mounts, so a failed run keeps the last good preview.
- The frame runs with `sandbox="allow-scripts"`. It has its own origin, so the app cannot reach the docs site.
- Files are saved in this browser, so a reload keeps them. Reset restores the starter.

> [!NOTE]
> Each run starts the app again. A counter in the preview goes back to 0 after an edit.

## Limits

| Topic      | Limit                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Styles     | Sass runs in the browser. `@use` finds the playground files, such as `_theme.scss`. Files on disk are not read       |
| TypeScript | Types are removed, not checked                                                                                        |
| Imports    | Only `lucia` and the playground files. npm packages do not load                                                       |
| Errors     | Compile errors show a position. Errors that happen while the app runs show a message only                             |

## Build

The preview loads the runtime from `public/playground/lucia.js`. `bun run dev` and `bun run build` write it first, with `scripts/playground-runtime.ts`. If you run the `lucia` command on `examples/web` yourself, run that script first.

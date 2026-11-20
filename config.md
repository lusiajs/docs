[Back to README](../README.md)

# Config

`lucia.config.json` sets the options of `lucia build` and `lucia dev`, so you do not repeat them on every run.

> [!NOTE]
> Put the file in the app folder, next to `index.html`. It is read from the folder you pass to the command. A missing file means the defaults.

```json
{
  "$schema": "./node_modules/lucia/config.schema.json",
  "outdir": "dist",
  "minify": true,
  "routes": ["/guide", "/reference"],
  "dev": { "port": 3000 },
  "lazy": { "mode": "smart", "prefetch": "idle" }
}
```

## Keys

| Key             | Type                     | Default | What it does                                                    |
| --------------- | ------------------------ | ------- | --------------------------------------------------------------- |
| `outdir`        | text                     | `dist`  | Output folder for `lucia build`                                 |
| `minify`        | `true` or `false`        | `true`  | Set `false` to keep the build readable                          |
| `routes`        | list of paths            | none    | Client routes that get their own `index.html`, such as `/guide` |
| `dev.port`      | whole number, 0 to 65535 | `3000`  | Port for `lucia dev`. `0` picks a free port                     |
| `lazy.mode`     | `smart`, `all` or `off`  | `smart` | Which components load later. See [Lazy components](lazy.md)     |
| `lazy.prefetch` | `idle`, `view` or `none` | `idle`  | When the later parts start to download                          |

## Which value wins

| Order | Source              | Example                    |
| ----- | ------------------- | -------------------------- |
| 1     | Command flag        | `lucia build --outdir out` |
| 2     | `PORT` (dev only)   | `PORT=5000 lucia dev`      |
| 3     | `lucia.config.json` | `"dev": { "port": 4000 }`  |
| 4     | Default             | `3000`                     |

> [!TIP]
> The `$schema` line makes the editor check the file and list the keys.

## Errors

An unknown key, or a value that is not allowed, stops the command. The error names the key and lists the allowed values, with code [L3004](errors.md#l3004).

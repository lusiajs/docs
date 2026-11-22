// The files `bun create lusiajs` writes, copied from create/template. Quotes are escaped so
// the docs build does not read the imports inside these texts.
export const templateFiles: { path: string; text: string }[] = [
  {
    path: "_gitignore",
    text: `node_modules
dist
`,
  },
  {
    path: "index.html",
    text: `<!doctype html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Lusia app</title>
  </head>
  <body>
    <script type=\"module\" src=\"./src/main.ts\"></script>
  </body>
</html>
`,
  },
  {
    path: "lusia.config.ts",
    text: `import { defineConfig } from \"lusiajs/config\";

export default defineConfig({ outdir: \"dist\" });
`,
  },
  {
    path: "package.json",
    text: `{
  \"name\": \"my-lusia-app\",
  \"private\": true,
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"lusia dev .\",
    \"build\": \"lusia build .\"
  },
  \"dependencies\": {
    \"lusiajs\": \"^0.1.0-beta.1\"
  },
  \"devDependencies\": {
    \"@types/bun\": \"latest\",
    \"typescript\": \"^5.6.0\"
  }
}
`,
  },
  {
    path: "tsconfig.json",
    text: `{
  \"compilerOptions\": {
    \"strict\": true,
    \"target\": \"ESNext\",
    \"module\": \"ESNext\",
    \"moduleResolution\": \"bundler\",
    \"types\": [\"bun\"],
    \"noEmit\": true,
    \"allowImportingTsExtensions\": true,
    \"verbatimModuleSyntax\": true
  },
  \"include\": [\"src\", \"lusia.config.ts\", \"node_modules/lusiajs/lusia.d.ts\"]
}
`,
  },
  {
    path: "src/App.lusia",
    text: `<script>
  import { variable } from \"lusiajs\";

  const count = variable(0);
</script>

<main>
  <h1>Hello Lusia</h1>
  <button onclick={() => count.value++}>Clicked {count.value} times</button>
</main>

<style>
  main {
    font-family: system-ui;
    padding: 2rem;
  }

  button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
</style>
`,
  },
  {
    path: "src/main.ts",
    text: `import { attach } from \"lusiajs\";
import App from \"./App.lusia\";

attach(App, document.body);
`,
  },
];

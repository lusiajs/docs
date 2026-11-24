import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { ENTRY_FILE } from "./names.ts";
import { loadFiles, migrateImports } from "./storage.ts";

const KEY = "lusia-playground-files";

let stored: Map<string, string>;
let writes: number;

beforeEach(() => {
  stored = new Map();
  writes = 0;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => {
        writes++;
        stored.set(key, value);
      },
    },
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, "localStorage");
});

describe("migrateImports", () => {
  test("rewrites a static import from lusia", () => {
    expect(migrateImports(`import { variable } from "lusia";`)).toBe(
      `import { variable } from "lusiajs";`,
    );
  });

  test("rewrites subpaths and single quotes", () => {
    expect(migrateImports(`import api from 'lusia/api';`)).toBe(`import api from 'lusiajs/api';`);
  });

  test("rewrites side-effect imports and dynamic imports", () => {
    expect(migrateImports(`import "lusia";`)).toBe(`import "lusiajs";`);
    expect(migrateImports(`const m = await import("lusia/editor");`)).toBe(
      `const m = await import("lusiajs/editor");`,
    );
  });

  test("rewrites re-exports", () => {
    expect(migrateImports(`export { variable } from "lusia";`)).toBe(
      `export { variable } from "lusiajs";`,
    );
  });

  test("leaves lusiajs and other packages alone", () => {
    const code = `import { variable } from "lusiajs";\nimport x from "lusia-tools";`;
    expect(migrateImports(code)).toBe(code);
  });

  test("leaves text that is not an import specifier alone", () => {
    const code = `const name = "lusia";\nconst label = "from lusia docs";`;
    expect(migrateImports(code)).toBe(code);
  });
});

describe("loadFiles", () => {
  test("rewrites saved imports and saves the result back", () => {
    const saved = [
      { name: ENTRY_FILE, code: `import { variable } from "lusia";` },
      { name: "Card.lusia", code: `import { props } from "lusia/api";` },
    ];
    stored.set(KEY, JSON.stringify(saved));

    const files = loadFiles();

    expect(files.map((file) => file.code)).toEqual([
      `import { variable } from "lusiajs";`,
      `import { props } from "lusiajs/api";`,
    ]);
    expect(JSON.parse(stored.get(KEY) ?? "[]")).toEqual(files);
  });

  test("keeps files that need no migration without saving again", () => {
    const saved = [{ name: ENTRY_FILE, code: `import { variable } from "lusiajs";` }];
    stored.set(KEY, JSON.stringify(saved));

    expect(loadFiles()).toEqual(saved);
    expect(writes).toBe(0);
  });
});

import { describe, expect, test } from "bun:test";
import { findBrokenImports, linkImports, rootNames } from "../../src/live/imports.ts";

const names = new Set(["App.lusia", "Card.lusia", "util.ts", "src/demos/x/Badge.lusia"]);

describe("linkImports", () => {
  test("points imports between files at their module names", () => {
    const code = `import Card from "./Card.lusia";\nconst util = await import('./util.ts');`;
    expect(linkImports(code, "App.lusia", names)).toBe(
      `import Card from "@live/Card.lusia";\nconst util = await import('@live/util.ts');`,
    );
  });

  test("resolves a parent folder against the importing file", () => {
    const code = `import Badge from "../x/Badge.lusia";`;
    expect(linkImports(code, "src/demos/y/Props.lusia", names)).toBe(
      `import Badge from "@live/src/demos/x/Badge.lusia";`,
    );
  });

  test("keeps imports of other modules, such as lusia", () => {
    const code = `import { variable } from "lusiajs";\nimport Missing from "./Missing.lusia";`;
    expect(linkImports(code, "App.lusia", names)).toBe(code);
  });
});

describe("findBrokenImports", () => {
  test("lists imports that name no file, with their line", () => {
    const source = `const x = 1;\nimport Missing from "./Missing.lusia";\nimport Card from "./Card.lusia";`;
    expect(findBrokenImports(source, "App.lusia", names)).toEqual([
      { specifier: "./Missing.lusia", line: 2 },
    ]);
  });
});

describe("rootNames", () => {
  test("lists the .lusia files that nothing imports", () => {
    const files = [
      { name: "src/A.lusia", code: `import B from "./B.lusia";` },
      { name: "src/B.lusia", code: "" },
      { name: "src/C.lusia", code: "" },
      { name: "src/util.ts", code: "" },
    ];
    expect(rootNames(files)).toEqual(["src/A.lusia", "src/C.lusia"]);
  });

  test("a file that imports itself is still a root", () => {
    const files = [
      { name: "src/Folder.lusia", code: `import Folder from "./Folder.lusia";` },
      { name: "src/App.lusia", code: `import Folder from "./Folder.lusia";` },
    ];
    expect(rootNames(files)).toEqual(["src/App.lusia"]);
    const alone = [{ name: "src/Folder.lusia", code: `import Folder from "./Folder.lusia";` }];
    expect(rootNames(alone)).toEqual(["src/Folder.lusia"]);
  });
});

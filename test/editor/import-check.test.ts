import { describe, expect, test } from "bun:test";
import { diagnosticsFor } from "../../src/editor/diagnostics.ts";
import { wrongLusiaImports } from "../../src/editor/import-check.ts";

const noChildren = () => undefined;

describe("wrongLusiaImports", () => {
  test("finds an import from lusia", () => {
    const code = `import a from "lusia";`;
    expect(wrongLusiaImports(code)).toEqual([{ from: 14, to: 21 }]);
  });

  test("finds an import from a lusia subpath, with single quotes", () => {
    const code = `import { b } from 'lusia/api';`;
    expect(wrongLusiaImports(code)).toEqual([{ from: 18, to: 29 }]);
  });

  test("ignores lusiajs and other packages", () => {
    const code = `import a from "lusiajs";\nimport b from "lusia-extra";\nimport c from "./lusia";`;
    expect(wrongLusiaImports(code)).toEqual([]);
  });

  test("ignores the string outside an import declaration", () => {
    const code = `const name = "lusia";\nconsole.log("lusia/api");`;
    expect(wrongLusiaImports(code)).toEqual([]);
  });
});

describe("wrong lusia import diagnostic", () => {
  test("marks the string in a .lusia script as an error", () => {
    const source = `<script>\nimport { variable } from "lusia";\n</script>\n<p>x</p>\n`;
    const [error] = diagnosticsFor(source, "App.lusia", noChildren);
    expect(error).toMatchObject({
      code: "wrong-import",
      message: `"lusia" is not a package. Import from "lusiajs".`,
      line: 2,
      column: 26,
      length: 7,
      severity: "error",
      source: "lusia",
      where: "App.lusia:2:26",
    });
  });

  test("marks the string in a .ts file", () => {
    const [error] = diagnosticsFor(`import x from "lusia/api";\n`, "util.ts", noChildren);
    expect(error).toMatchObject({ code: "wrong-import", line: 1, column: 15, length: 11 });
  });

  test("a valid lusiajs import has no error", () => {
    const source = `<script>\nimport { variable } from "lusiajs";\n</script>\n<p>x</p>\n`;
    expect(diagnosticsFor(source, "App.lusia", noChildren)).toEqual([]);
  });
});

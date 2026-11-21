import { describe, expect, test } from "bun:test";
import { Text } from "@codemirror/state";
import { diagnosticRange } from "../../src/editor/lint-source.ts";
import { diagnosticsFor } from "../../src/editor/diagnostics.ts";

const noChildren = () => undefined;

describe("compile errors", () => {
  test("a LusiaError has its code, hint and 1-based position", () => {
    const [error] = diagnosticsFor(
      "<p>a</p>\n<ELSE>\n  <p>b</p>\n</ELSE>\n",
      "App.lusia",
      noChildren,
    );
    expect(error).toMatchObject({
      line: 2,
      column: 1,
      severity: "error",
      source: "lusia",
      code: "L1034",
      where: "App.lusia:2:1",
    });
    expect(error?.hint).toBeString();
  });

  test("a valid file has no errors", () => {
    const source = `<script>\nimport { variable } from "lusia";\nconst count = variable(0);\n</script>\n<p>{count.value}</p>\n`;
    expect(diagnosticsFor(source, "App.lusia", noChildren)).toEqual([]);
  });
});

describe("syntax errors in the script", () => {
  test("a script error is placed on its line and column", () => {
    const [error] = diagnosticsFor("<script>\nconst a = ;\n</script>\n", "App.lusia", noChildren);
    expect(error).toMatchObject({ code: "syntax", line: 2, column: 11, severity: "error" });
  });

  test("a .ts file is checked as script", () => {
    const [error] = diagnosticsFor("const a = 1;\nconst b = (;\n", "util.ts", noChildren);
    expect(error).toMatchObject({ code: "syntax", line: 2, column: 12 });
  });
});

describe("lint warnings", () => {
  test("an unused import is a warning at its line", () => {
    const source = `<script>\nimport Badge from "./Badge.lusia";\n</script>\n<p>x</p>\n`;
    const [warning] = diagnosticsFor(source, "App.lusia", noChildren);
    expect(warning).toMatchObject({
      code: "unused-import",
      line: 2,
      column: 1,
      severity: "warning",
      source: "lusia-lint",
      where: "App.lusia:2:1",
    });
  });

  test("the compile error comes first, then the lint warning, as in the extension", () => {
    const found = diagnosticsFor("<p>x</p>\n\n<p>{}</p>\n", "App.lusia", noChildren);
    expect(found.map((item) => item.code)).toEqual(["L1011", "empty-expression"]);
  });
});

describe("diagnosticRange", () => {
  const doc = Text.of(["abc", "defgh"]);

  test("maps a line and column to offsets, to the end of the line", () => {
    expect(diagnosticRange(doc, { line: 2, column: 3 })).toEqual({ from: 6, to: 9 });
  });

  test("uses the length when the error has one", () => {
    expect(diagnosticRange(doc, { line: 2, column: 2, length: 2 })).toEqual({ from: 5, to: 7 });
  });

  test("stays inside the document for a line past the end", () => {
    expect(diagnosticRange(doc, { line: 9, column: 1 })).toEqual({ from: 4, to: 9 });
  });
});

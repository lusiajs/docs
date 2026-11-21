import { describe, expect, test } from "bun:test";
import { editorCompletions } from "../../src/editor/editor-completions.ts";
import type { CompletionResult } from "../../../src/editor/completions.ts";

const FILE = "App.lusia";
const BADGE_SCRIPT = `<script>\nimport Badge from "./Badge.lusia";\nconst count = variable(0);\n`;

/** The completions at the first `|` in `source`. The marker is removed first. */
function completeAt(source: string, files: { name: string; code: string }[] = [], fileName = FILE) {
  const offset = source.indexOf("|");
  const text = source.replace("|", "");
  return editorCompletions(text, offset, fileName, files);
}

function labelsOf(items: CompletionResult[]): string[] {
  return items.map((item) => item.label);
}

describe("script completions", () => {
  test("offers lusia API names, each with an import edit", () => {
    const items = completeAt("<script>\n|\n</script>");
    const variable = items.find((item) => item.label === "variable");
    expect(variable?.importEdit).toEqual({
      start: 8,
      end: 8,
      text: 'import { variable } from "lusia";\n',
    });
  });

  test("API items link to their reference/api.ts entry for the docs popup", () => {
    const items = completeAt("<script>\n|\n</script>");
    expect(items.find((item) => item.label === "variable.compute")?.entryId).toBe(
      "variable-compute",
    );
  });

  test("offers names declared in the file", () => {
    const items = completeAt(`${BADGE_SCRIPT}|\n</script>`);
    expect(labelsOf(items)).toContain("count");
    expect(labelsOf(items)).toContain("Badge");
  });

  test("offers the names declared in the file inside {...} in markup", () => {
    const items = completeAt(`${BADGE_SCRIPT}</script>\n<p>{co|}</p>`);
    expect(labelsOf(items)).toContain("count");
  });

  test("a variable offers its members after its name and dot", () => {
    const items = completeAt(`${BADGE_SCRIPT}</script>\n<p>{count.|}</p>`);
    expect(labelsOf(items)).toEqual(["value", "get", "set", "peek", "onUpdate"]);
  });

  test("offers a function imported from a sibling .ts file, with its signature and docs", () => {
    const util = {
      name: "util.ts",
      code: `/**\n * Adds two numbers.\n */\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n`,
    };
    const items = completeAt(`<script>\nimport { add } from "./util.ts";\n|</script>`, [util]);
    const add = items.find((item) => item.label === "add");
    expect(add).toMatchObject({
      kind: "function",
      detail: "function add(a: number, b: number): number",
      documentation: "Adds two numbers.",
    });
    expect(add?.importEdit).toBeUndefined();
  });
});

describe("markup completions", () => {
  test("after <, offers the imported components and the flow tags", () => {
    const items = completeAt(`${BADGE_SCRIPT}</script>\n<|`);
    expect(labelsOf(items)).toEqual(expect.arrayContaining(["Badge", "IF", "ELSEIF", "EACH"]));
  });

  test("inside an EACH tag, offers as, index and key", () => {
    const items = completeAt(`<script>\n</script>\n<EACH {list} |>`);
    expect(labelsOf(items)).toEqual(["as", "index", "key"]);
  });

  test("on a plain tag, offers animate, the events and bind-element", () => {
    const items = completeAt(`<script>\n</script>\n<button |>`);
    expect(labelsOf(items)).toEqual(expect.arrayContaining(["animate", "onclick", "bind-element"]));
  });

  test("on an input, also offers bind-value", () => {
    const items = completeAt(`<script>\n</script>\n<input |>`);
    expect(labelsOf(items)).toContain("bind-value");
  });

  test("inside animate={...}, offers the item keys", () => {
    const items = completeAt(`<script>\n</script>\n<div animate={{ |}}></div>`);
    expect(labelsOf(items)).toEqual(expect.arrayContaining(["style", "when", "duration"]));
  });

  test("a component tag offers the props the imported file declares", () => {
    const badge = { name: "Badge.lusia", code: `<script>\nprops({ label: "New" })\n</script>` };
    const items = completeAt(`${BADGE_SCRIPT}</script>\n<Badge |`, [badge]);
    expect(labelsOf(items)).toEqual(["label"]);
  });
});

describe(".ts files", () => {
  test("offer the names in the file, and no import for a name already imported", () => {
    const items = completeAt(
      'import { variable } from "lusia";\nconst total = 1;\n|',
      [],
      "util.ts",
    );
    expect(labelsOf(items)).toContain("total");
    const from = items.find((item) => item.label === "variable.compute");
    expect(from?.importEdit).toBeUndefined();
  });

  test("onAttach is a lusia export with an auto-import", () => {
    const onAttach = completeAt("const x = 1;\n|", [], "util.ts").find(
      (item) => item.label === "onAttach",
    );
    expect(onAttach?.importEdit).toEqual({
      start: 0,
      end: 0,
      text: 'import { onAttach } from "lusia";\n',
    });
  });

  test("a new API name gets an import at the top of the file", () => {
    const items = completeAt("const x = 1;\n|", [], "util.ts");
    const props = items.find((item) => item.label === "props({ ... })");
    expect(props?.importEdit).toEqual({
      start: 0,
      end: 0,
      text: 'import { props } from "lusia";\n',
    });
  });
});

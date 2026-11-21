import { describe, expect, test } from "bun:test";
import { editorHover } from "../../src/editor/editor-hover.ts";
import { hoverMarkdown } from "lusia/editor/markdown.ts";

const UTIL = {
  name: "util.ts",
  code: `/**
 * Adds two numbers.
 */
export function add(a: number, b: number): number {
  return a + b;
}
`,
};

/** The markdown at the first `|` in `source`, or undefined when nothing is hovered. */
function hoverAt(
  source: string,
  files: { name: string; code: string }[],
  fileName: string,
): string | undefined {
  const offset = source.indexOf("|");
  const text = source.slice(0, offset) + source.slice(offset + 1);
  const result = editorHover(text, offset, fileName, files);
  return result ? hoverMarkdown(result) : undefined;
}

describe("editor hover for imported symbols", () => {
  test("shows the signature and JSDoc of a function imported into a .lusia file", () => {
    const source = `<script>\nimport { add } from "./util.ts";\n</script>\n<p>{ad|d(1, 2)}</p>`;
    const markdown = hoverAt(source, [UTIL], "App.lusia");
    expect(markdown).toContain("function add(a: number, b: number): number");
    expect(markdown).toContain("Adds two numbers.");
    expect(markdown).toContain("From `./util.ts`");
  });

  test("shows it in a .ts tab that imports another .ts file", () => {
    const source = `import { add } from "./util.ts";\nconst total = ad|d(1, 2);\n`;
    const markdown = hoverAt(source, [UTIL], "app.ts");
    expect(markdown).toContain("function add(a: number, b: number): number");
    expect(markdown).toContain("Adds two numbers.");
  });
});

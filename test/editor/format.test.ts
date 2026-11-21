import { describe, expect, test } from "bun:test";
import { formatFile } from "../../src/editor/format-file.ts";

const SAMPLE = `<style scoped>
.card{padding:1rem}
</style>
<script>
import {variable} from "lusiajs";
const name=variable("Ada");
</script>
<p class="a {name}">Hi {name.value}</p>
<button disabled={name.value === "" || {a:1}.a}>Go</button>
`;

describe("format a .lusia file", () => {
  test("is idempotent", async () => {
    const once = await formatFile("App.lusia", SAMPLE);
    expect(await formatFile("App.lusia", once)).toBe(once);
  });

  test("keeps every {expr} and a whole attribute value as an expression", async () => {
    const output = await formatFile("App.lusia", SAMPLE);
    expect(output).toContain("{name.value}");
    expect(output).toContain('disabled={name.value === "" || {a:1}.a}');
    expect(output).toContain('class="a {name}"');
  });

  test("formats the script as TypeScript and keeps the section order", async () => {
    const output = await formatFile("App.lusia", SAMPLE);
    expect(output).toContain('const name = variable("Ada");');
    expect(output).toContain("</style>\n\n<script>");
    expect(output).toContain("</script>\n\n<p ");
  });

  test("keeps the style attribute", async () => {
    expect(await formatFile("App.lusia", SAMPLE)).toContain("<style scoped>");
  });
});

describe("format a .ts file", () => {
  test("formats as TypeScript with one newline at the end", async () => {
    expect(await formatFile("util.ts", "const   x=1")).toBe("const x = 1;\n");
  });

  test("an empty file stays empty", async () => {
    expect(await formatFile("util.ts", "  \n")).toBe("");
  });

  test("a syntax error rejects, so the editor can report it", async () => {
    await expect(formatFile("util.ts", "const x = {")).rejects.toThrow();
  });
});

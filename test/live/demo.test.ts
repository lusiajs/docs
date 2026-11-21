import { describe, expect, test } from "bun:test";
import { catalog } from "../../src/catalog.ts";
import { buildDemo } from "../../src/live/demo-build.ts";

const demos = Object.values(catalog).flatMap((entry) => entry.demos ?? []);

describe("Guide demos in the live build", () => {
  test.each(demos.map((demo) => [demo.id, demo] as const))("%s builds", (_id, demo) => {
    const result = buildDemo(demo.sources.map((file) => ({ name: file.path, code: file.text })));
    if (!result.bundle) throw new Error(`${result.errors[0]?.message} (${result.errors[0]?.file})`);
    expect(result.bundle.entries.length).toBeGreaterThan(0);
    expect(result.bundle.styles).toContain("--");
  });

  test("an edited file replaces the original one", () => {
    const first = demos[0]!.sources[0]!;
    const result = buildDemo([{ name: first.path, code: "<p>changed</p>" }]);
    if (!result.bundle) throw new Error(result.errors[0]?.message);
    expect(result.bundle.modules[first.path]).toContain('"<p>changed</p>"');
  });

  test("a compile error comes back as data with its file", () => {
    const result = buildDemo([
      { name: "src/broken/Bad.lusia", code: "<script>\nlet = ;\n</script>\n<p>x</p>" },
    ]);
    expect(result.bundle).toBeUndefined();
    expect(result.errors[0]?.file).toBe("src/broken/Bad.lusia");
  });
});

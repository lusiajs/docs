import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const MAX_WIDTH = 90;
const SOURCE_ROOTS = ["../src/demos/", "../src/components/"].map(
  (path) => new URL(path, import.meta.url),
);

const sources = SOURCE_ROOTS.flatMap((root) =>
  [...new Bun.Glob("**/*.lusia").scanSync({ cwd: root.pathname })].map((file) => ({ root, file })),
);

function longLines(root: URL, file: string): number[] {
  const lines = readFileSync(new URL(file, root), "utf8").split("\n");
  return lines.flatMap((line, index) => (line.length > MAX_WIDTH ? [index + 1] : []));
}

describe("example source width", () => {
  test("finds example sources", () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  test.each(sources)("$file has no line over 90 characters", ({ root, file }) => {
    expect(longLines(root, file)).toEqual([]);
  });
});

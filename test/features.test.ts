import { describe, expect, test } from "bun:test";
import { featureSnippets } from "../src/features.ts";
import { buildLive } from "../src/live/build.ts";

const single = ["variables", "flow", "animate", "singleFile", "scoped"] as const;

describe("Home feature snippets", () => {
  test.each(single)("%s compiles", (key) => {
    const result = buildLive([{ name: "Demo.lusia", code: featureSnippets[key] }], {
      entries: ["Demo.lusia"],
    });
    expect(result.errors).toEqual([]);
    expect(result.bundle).toBeDefined();
  });

  test("props card and its usage compile together", () => {
    const result = buildLive(
      [
        { name: "App.lusia", code: featureSnippets.propsUse },
        { name: "Card.lusia", code: featureSnippets.propsCard },
      ],
      { entries: ["App.lusia"] },
    );
    expect(result.errors).toEqual([]);
    expect(result.bundle?.entries).toEqual(["App.lusia"]);
  });

  test("the editor mock shows a real error: an unclosed expression", () => {
    const result = buildLive([{ name: "Bad.lusia", code: "<p>{count</p>" }], { entries: ["Bad.lusia"] });
    expect(result.bundle).toBeUndefined();
    expect(result.errors[0]).toMatchObject({ message: "unclosed {", code: "L1010", line: 1 });
  });
});

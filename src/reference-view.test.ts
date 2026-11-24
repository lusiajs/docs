import { describe, expect, test } from "bun:test";
import { entryIdFromHash } from "./reference-view.ts";

describe("entryIdFromHash", () => {
  test("returns the id when the hash names one", () => {
    expect(entryIdFromHash("#variable", ["variable", "on"])).toBe("variable");
  });

  test("returns undefined for an empty or unknown hash", () => {
    expect(entryIdFromHash("", ["variable"])).toBeUndefined();
    expect(entryIdFromHash("#", ["variable"])).toBeUndefined();
    expect(entryIdFromHash("#missing", ["variable"])).toBeUndefined();
  });

  test("decodes an encoded id", () => {
    expect(entryIdFromHash("#variable%2Ecompute", ["variable.compute"])).toBe("variable.compute");
  });

  test("returns undefined for a bad encoding", () => {
    expect(entryIdFromHash("#%E0%A4%A", ["variable"])).toBeUndefined();
  });
});

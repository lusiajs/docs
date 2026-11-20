import { describe, expect, test } from "bun:test";
import { withRecent } from "./recent.ts";

describe("withRecent", () => {
  test("puts the newest term first", () => {
    expect(withRecent(["bind"], "variable")).toEqual(["variable", "bind"]);
  });

  test("moves a repeated term to the front without duplicating it", () => {
    expect(withRecent(["bind", "variable"], "variable")).toEqual(["variable", "bind"]);
  });

  test("keeps only the last five terms", () => {
    const list = ["a", "b", "c", "d", "e"];
    expect(withRecent(list, "f")).toEqual(["f", "a", "b", "c", "d"]);
  });
});

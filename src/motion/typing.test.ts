import { describe, expect, test } from "bun:test";
import { typeOnceFrames } from "./typing.ts";

describe("typeOnceFrames", () => {
  test("types one letter per frame and stops at the full text", () => {
    expect(typeOnceFrames("abc")).toEqual(["a", "ab", "abc"]);
  });

  test("the last frame is the whole text", () => {
    const frames = typeOnceFrames("bun add lusiajs");
    expect(frames.length).toBe(15);
    expect(frames.at(-1)).toBe("bun add lusiajs");
  });
});

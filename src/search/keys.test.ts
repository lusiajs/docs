import { describe, expect, test } from "bun:test";
import { groupJump, groupStarts, moveIndex, opensSearch } from "./keys.ts";

describe("moveIndex", () => {
  test("steps down and up", () => {
    expect(moveIndex(0, 3, 1)).toBe(1);
    expect(moveIndex(2, 3, -1)).toBe(1);
  });

  test("wraps at both ends", () => {
    expect(moveIndex(2, 3, 1)).toBe(0);
    expect(moveIndex(0, 3, -1)).toBe(2);
  });

  test("stays at zero with no rows", () => {
    expect(moveIndex(0, 0, 1)).toBe(0);
  });
});

describe("groupStarts", () => {
  test("gives the first row of each group", () => {
    expect(groupStarts([2, 3, 1])).toEqual([0, 2, 5]);
  });

  test("handles no groups", () => {
    expect(groupStarts([])).toEqual([]);
  });
});

describe("groupJump", () => {
  const starts = [0, 2, 5];

  test("Tab moves to the first row of the next group", () => {
    expect(groupJump(starts, 0, 1)).toBe(2);
    expect(groupJump(starts, 3, 1)).toBe(5);
  });

  test("Tab from the last group wraps to the first", () => {
    expect(groupJump(starts, 6, 1)).toBe(0);
  });

  test("Shift+Tab moves to the start of the previous group", () => {
    expect(groupJump(starts, 3, -1)).toBe(0);
    expect(groupJump(starts, 0, -1)).toBe(5);
  });

  test("returns zero with no groups", () => {
    expect(groupJump([], 0, 1)).toBe(0);
  });
});

describe("opensSearch", () => {
  const plain = { key: "a", ctrlKey: false, metaKey: false };

  test("Ctrl+K and Cmd+K open it, even while typing", () => {
    expect(opensSearch({ ...plain, key: "k", ctrlKey: true }, true)).toBe(true);
    expect(opensSearch({ ...plain, key: "K", metaKey: true }, false)).toBe(true);
  });

  test("a slash opens it only outside a field", () => {
    expect(opensSearch({ ...plain, key: "/" }, false)).toBe(true);
    expect(opensSearch({ ...plain, key: "/" }, true)).toBe(false);
  });

  test("other keys do nothing", () => {
    expect(opensSearch(plain, false)).toBe(false);
    expect(opensSearch({ ...plain, key: "k" }, false)).toBe(false);
  });
});

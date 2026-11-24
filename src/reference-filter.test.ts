import { describe, expect, test } from "bun:test";
import type { ApiEntry } from "lusiajs/api";
import { createReferenceFilter } from "./reference-filter.ts";

function entry(id: string, kind: ApiEntry["kind"], summary: string): ApiEntry {
  return {
    id,
    name: id,
    kind,
    group: "basics",
    signature: "",
    summary,
    bullets: [],
    example: "",
  };
}

const ENTRIES: ApiEntry[] = [
  entry("variable", "function", "creates a value"),
  entry("on", "value", "attach timing"),
  entry("each", "markup", "loops over a list"),
];

describe("createReferenceFilter", () => {
  test("shows every entry and the full count at first", () => {
    const filter = createReferenceFilter(ENTRIES);
    expect(filter.count.value).toBe("3 entries");
    expect(filter.empty.value).toBe(false);
    expect(filter.isShown("on")).toBe(true);
  });

  test("filters by text, case and spacing do not matter", () => {
    const filter = createReferenceFilter(ENTRIES);
    filter.text.value = "  LOOPS ";
    expect(filter.isShown("each")).toBe(true);
    expect(filter.isShown("on")).toBe(false);
    expect(filter.count.value).toBe("1 of 3 entries");
  });

  test("filters by picked kinds and unpicks them again", () => {
    const filter = createReferenceFilter(ENTRIES);
    filter.toggleKind("value");
    expect(filter.isKindPicked("value")).toBe(true);
    expect(filter.isShown("variable")).toBe(false);
    expect(filter.isShown("on")).toBe(true);
    filter.toggleKind("value");
    expect(filter.isShown("variable")).toBe(true);
  });

  test("reports an empty result and clears back to all", () => {
    const filter = createReferenceFilter(ENTRIES);
    filter.text.value = "nothing matches this";
    expect(filter.empty.value).toBe(true);
    filter.clear();
    expect(filter.empty.value).toBe(false);
    expect(filter.count.value).toBe("3 entries");
  });

  test("a group is shown when one of its ids is", () => {
    const filter = createReferenceFilter(ENTRIES);
    filter.text.value = "attach";
    expect(filter.hasShown(["variable", "on"])).toBe(true);
    expect(filter.hasShown(["variable", "each"])).toBe(false);
  });
});

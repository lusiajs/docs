import { describe, expect, test } from "bun:test";
import type { ApiEntry } from "../../reference/api.ts";
import {
  flattenMembers,
  kindsOf,
  matchesFilter,
  searchText,
  wrapSignature,
} from "./reference-model.ts";

function entry(id: string, overrides: Partial<ApiEntry> = {}): ApiEntry {
  return {
    id,
    name: `${id}()`,
    kind: "function",
    group: "reactivity",
    signature: "",
    summary: `Summary of ${id}.`,
    bullets: [],
    example: "",
    ...overrides,
  };
}

describe("wrapSignature", () => {
  test("keeps a short signature on one line", () => {
    expect(wrapSignature("variable<T>(initial: T): Variable<T>")).toBe(
      "variable<T>(initial: T): Variable<T>",
    );
  });

  test("puts each parameter on its own line when long", () => {
    expect(
      wrapSignature("attach(component: Component, target: Element, props?: Props): Instance"),
    ).toBe("attach(\n  component: Component,\n  target: Element,\n  props?: Props\n): Instance");
  });

  test("keeps commas inside nested brackets and arrows", () => {
    const long =
      "variable.autoRun(fn: (a: number, b: number) => void, extra: Record<string, unknown>): void";
    expect(wrapSignature(long)).toBe(
      "variable.autoRun(\n  fn: (a: number, b: number) => void,\n  extra: Record<string, unknown>\n): void",
    );
  });

  test("leaves a long signature with one parameter alone", () => {
    const long = "props<D extends Record<string, unknown>>(defaults: D): PropVariables<D>";
    expect(wrapSignature(long)).toBe(long);
  });

  test("leaves text without a parameter list alone", () => {
    const long =
      "const WHEN: { readonly ATTACH: When; readonly DETACH: When; readonly VIEW: When }";
    expect(wrapSignature(long)).toBe(long);
  });
});

describe("flattenMembers", () => {
  test("indents nested members by depth", () => {
    const rows = flattenMembers([
      { name: "STYLE", summary: "Curves.", members: [{ name: "LINEAR", summary: "Flat." }] },
      { name: "IN", summary: "In." },
    ]);
    expect(rows).toEqual([
      { name: "STYLE", summary: "Curves.", depth: 0 },
      { name: "LINEAR", summary: "Flat.", depth: 1 },
      { name: "IN", summary: "In.", depth: 0 },
    ]);
  });

  test("returns no rows without members", () => {
    expect(flattenMembers(undefined)).toEqual([]);
  });
});

describe("filter", () => {
  test("searches the name, summary and member names, ignoring case", () => {
    const search = searchText(
      entry("easing", { name: "EASE", members: [{ name: "QUART", summary: "Strong." }] }),
    );
    expect(search).toContain("ease");
    expect(search).toContain("quart");
  });

  test("matches the query and the picked kinds", () => {
    const item = { kind: "value", search: "when attach" };
    expect(matchesFilter(item, " ATTACH ", new Set())).toBe(true);
    expect(matchesFilter(item, "attach", new Set(["value"]))).toBe(true);
    expect(matchesFilter(item, "attach", new Set(["function"]))).toBe(false);
    expect(matchesFilter(item, "missing", new Set())).toBe(false);
  });

  test("lists each kind once", () => {
    const kinds = kindsOf([entry("a"), entry("b", { kind: "value" }), entry("c")]);
    expect(kinds).toEqual(["function", "value"]);
  });
});

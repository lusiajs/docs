import { describe, expect, test } from "bun:test";
import { api, type ApiEntry } from "lusiajs/api";
import {
  countLabel,
  flattenMembers,
  KIND_INFO,
  KIND_ORDER,
  kindSections,
  kindsOf,
  matchesFilter,
  parameterRows,
  searchText,
  valueRows,
  withNeighbors,
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
    const long = "const ON: { readonly ATTACH: When; readonly DETACH: When; readonly VIEW: When }";
    expect(wrapSignature(long)).toBe(long);
  });
});

describe("flattenMembers", () => {
  test("indents nested members by depth", () => {
    const rows = flattenMembers([
      {
        name: "STYLE",
        summary: "Curves.",
        members: [{ name: "LINEAR", summary: "Flat." }],
      },
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

describe("valueRows", () => {
  test("marks the member its summary calls the default", () => {
    expect(
      valueRows([
        { name: "SUDDEN", summary: "Jumps. The default." },
        { name: "SMOOTH", summary: "Bends." },
      ]),
    ).toEqual([
      { name: "SUDDEN", summary: "Jumps. The default.", depth: 0, note: "Default" },
      { name: "SMOOTH", summary: "Bends.", depth: 0, note: "-" },
    ]);
  });

  test("returns no rows without members", () => {
    expect(valueRows(undefined)).toEqual([]);
  });
});

describe("parameterRows", () => {
  test("reads each parameter as a name, a type and whether it is optional", () => {
    expect(
      parameterRows(
        entry("attach", {
          signature: "attach(component: Component, target: Element, props?: Props): Instance",
        }),
      ),
    ).toEqual([
      { name: "component", type: "Component", optional: false },
      { name: "target", type: "Element", optional: false },
      { name: "props", type: "Props", optional: true },
    ]);
  });

  test("keeps arrows and brackets inside a parameter type", () => {
    const [hook] = parameterRows(
      entry("onAttach", {
        signature: "onAttach(hook: (root: ParentNode) => unknown): void",
      }),
    );
    expect(hook).toEqual({
      name: "hook",
      type: "(root: ParentNode) => unknown",
      optional: false,
    });
  });

  test("returns no rows for a function without parameters", () => {
    expect(parameterRows(entry("detach", { signature: "detach(): Promise<void>" }))).toEqual([]);
  });

  test("returns no rows when a parameter is not a name and a type", () => {
    expect(
      parameterRows(
        entry("config", {
          signature: "export default defineConfig({ animate: {} })",
        }),
      ),
    ).toEqual([]);
  });

  test("returns no rows for an entry that is not a function", () => {
    expect(
      parameterRows(
        entry("midway", {
          kind: "value",
          signature: "const MIDWAY: { readonly SWITCH: MidwayMode }",
        }),
      ),
    ).toEqual([]);
  });
});

describe("kindSections", () => {
  test("puts every entry in exactly one section", () => {
    const sections = kindSections(api);
    const ids = sections.flatMap((section) => section.entries.map((item) => item.id));
    expect(ids).toHaveLength(api.length);
    expect(new Set(ids).size).toBe(api.length);
  });

  test("follows the kind order with its label, icon and color", () => {
    const sections = kindSections(api);
    expect(sections.map((section) => section.kind)).toEqual(KIND_ORDER);
    expect(sections.map((section) => section.label)).toEqual(
      KIND_ORDER.map((kind) => KIND_INFO[kind].label),
    );
    expect(sections.map((section) => section.icon)).toEqual(
      KIND_ORDER.map((kind) => KIND_INFO[kind].icon),
    );
  });

  test("skips a kind without entries", () => {
    const sections = kindSections([entry("two", { kind: "type" }), entry("one")]);
    expect(sections.map((section) => section.kind)).toEqual(["function", "type"]);
  });

  test("keeps each entry in its own kind", () => {
    for (const section of kindSections(api)) {
      for (const item of section.entries) expect(item.kind).toBe(section.kind);
    }
  });

  test("sorts the entries of a section by name", () => {
    for (const section of kindSections(api)) {
      const names = section.entries.map((item) => item.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });
});

describe("withNeighbors", () => {
  test("gives the first entry of a kind no previous and the last no next", () => {
    const rows = withNeighbors([entry("a"), entry("b"), entry("c")]);
    expect(rows[0]!.previous).toBeUndefined();
    expect(rows[0]!.next?.id).toBe("b");
    expect(rows[1]!.previous?.id).toBe("a");
    expect(rows[1]!.next?.id).toBe("c");
    expect(rows[2]!.previous?.id).toBe("b");
    expect(rows[2]!.next).toBeUndefined();
  });

  test("gives a kind of one entry neither neighbour", () => {
    const rows = withNeighbors([entry("solo", { kind: "type" })]);
    expect(rows[0]!.previous).toBeUndefined();
    expect(rows[0]!.next).toBeUndefined();
  });

  test("never links entries across kinds", () => {
    const rows = withNeighbors([entry("f1"), entry("t1", { kind: "type" }), entry("f2")]);
    expect(rows[0]!.next?.id).toBe("f2");
    expect(rows[2]!.previous?.id).toBe("f1");
    expect(rows[1]!.previous).toBeUndefined();
    expect(rows[1]!.next).toBeUndefined();
  });
});

describe("countLabel", () => {
  test("shows the total when every entry shows", () => {
    expect(countLabel(53, 53)).toBe("53 entries");
    expect(countLabel(1, 1)).toBe("1 entry");
  });

  test("shows how many of the total show", () => {
    expect(countLabel(1, 53)).toBe("1 of 53 entries");
    expect(countLabel(0, 53)).toBe("0 of 53 entries");
  });
});

describe("filter", () => {
  test("searches the name, summary, signature, bullets and member rows, ignoring case", () => {
    const search = searchText(
      entry("easing", {
        name: "EASE",
        signature: "EASE.STYLE",
        bullets: ["Runs the tween on every update."],
        members: [{ name: "QUART", summary: "A strong curve." }],
      }),
    );
    expect(search).toContain("ease");
    expect(search).toContain("style");
    expect(search).toContain("tween");
    expect(search).toContain("quart");
    expect(search).toContain("strong curve");
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

  test("returns the kinds in the fixed order", () => {
    expect(kindsOf(api)).toEqual(KIND_ORDER);
    expect(kindsOf([entry("b", { kind: "type" }), entry("a")])).toEqual(["function", "type"]);
  });
});

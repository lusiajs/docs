import { describe, expect, test } from "bun:test";
import { buildSearchIndex, searchPages, type SearchEntry } from "./build.ts";
import { countRows, groupsFor, idleGroups, suggestedTerms, type Group, type Row } from "./rank.ts";
import { field } from "./fuzzy.ts";

const index = buildSearchIndex();

function entry(page: SearchEntry["page"], title: string, summary = "", keywords = ""): SearchEntry {
  return {
    page,
    section: "Test",
    href: `/${page.toLowerCase()}#${title}`,
    icon: "code",
    title: field(title),
    summary: field(summary),
    keywords: field(keywords),
  };
}

function titleOf(row: Row): string {
  return row.title.map((part) => part.text).join("");
}

function titles(groups: Group[]): string[] {
  return groups.flatMap((group) => group.rows.map(titleOf));
}

describe("groupsFor with an empty term", () => {
  test("shows suggestions when there is no history", () => {
    const groups = groupsFor(index, "  ", []);
    expect(groups.map((group) => group.label)).toEqual(["Suggestions"]);
    expect(titles(groups)).toEqual(suggestedTerms);
  });

  test("puts recent terms before the suggestions", () => {
    const groups = groupsFor(index, "", ["bind-value", "each"]);
    expect(groups.map((group) => group.label)).toEqual(["Recent", "Suggestions"]);
    expect(groups[0]!.rows[1]!.term).toBe("each");
  });

  test("numbers the rows in list order", () => {
    const groups = groupsFor(index, "", ["bind-value"]);
    const indexes = groups.flatMap((group) => group.rows.map((row) => row.index));
    expect(indexes).toEqual(indexes.map((_, i) => i));
  });
});

describe("groupsFor with a term", () => {
  test("finds the variable entry in the Reference and the Guide", () => {
    const groups = groupsFor(index, "variable", []);
    const labels = groups.map((group) => group.label);
    expect(labels).toContain("Guide");
    expect(labels).toContain("Reference");
    expect(labels.every((label) => (searchPages as readonly string[]).includes(label))).toBe(true);
  });

  test("ranks an exact title above a prefix title", () => {
    const reference = groupsFor(index, "variable", []).find(
      (group) => group.label === "Reference",
    )!;
    expect(titleOf(reference.rows[0]!)).toBe("Variable");
  });

  test("keeps the groups in page order", () => {
    const labels = groupsFor(index, "a", []).map((group) => group.label);
    const order = labels.map((label) => searchPages.indexOf(label as never));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test("requires every word to match", () => {
    expect(titles(groupsFor(index, "variable zzzqx", []))).toEqual(suggestedTerms);
  });

  test("counts the rows across groups", () => {
    expect(countRows(groupsFor(index, "variable", []))).toBeGreaterThan(1);
  });

  test("falls back to suggestions and reports no rows for a miss", () => {
    const groups = groupsFor(index, "zzzqx", []);
    expect(groups.map((group) => group.label)).toEqual(["Suggestions"]);
  });

  test("matches letters in order when the query is fuzzy", () => {
    const found = titles(groupsFor(index, "cpu", []));
    expect(found).toContain("variable.compute()");
  });

  test("highlights the matched letters of the title", () => {
    const row = groupsFor(index, "variable", []).find((group) => group.label === "Reference")!
      .rows[0]!;
    expect(row.title[0]).toEqual({ text: "Variable", hit: true });
  });

  test("breaks ties by the shorter title", () => {
    const groups = groupsFor(index, "variable", []);
    const reference = groups.find((group) => group.label === "Reference")!;
    const names = reference.rows.map(titleOf);
    expect(names.indexOf("variable()")).toBeLessThan(names.indexOf("variable.compute()"));
  });

  test("caps each page at twelve rows", () => {
    const many = [
      entry("Guide", "a1"),
      entry("Guide", "a2"),
      ...Array.from({ length: 20 }, (_, i) => entry("Guide", `a${i + 3}`)),
    ];
    const guide = groupsFor(many, "a", []).find((group) => group.label === "Guide")!;
    expect(guide.rows.length).toBe(12);
  });
});

describe("ranking", () => {
  test("puts a title hit above a keyword-only hit", () => {
    const groups = groupsFor(
      [entry("Reference", "other", "", "widget"), entry("Reference", "widget", "")],
      "widget",
      [],
    );
    expect(titles(groups)).toEqual(["widget", "other"]);
  });

  test("uses the summary to find an entry", () => {
    const groups = groupsFor([entry("Guide", "Alpha", "Turns the lights on")], "lights", []);
    expect(titles(groups)).toEqual(["Alpha"]);
  });
});

describe("idleGroups", () => {
  test("has no recent group without history", () => {
    expect(idleGroups([]).map((group) => group.label)).toEqual(["Suggestions"]);
  });
});

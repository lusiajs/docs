import { describe, expect, test } from "bun:test";
import type { ApiEntry } from "../../reference/api.ts";
import { buildKeywordIndex, tokenize } from "./keywords.ts";

const entries: ApiEntry[] = [
  {
    id: "variable",
    name: "variable()",
    kind: "function",
    group: "reactivity",
    signature: "",
    summary: "A value.",
    bullets: [],
    example: "",
  },
  {
    id: "variable-compute",
    name: "variable.compute()",
    kind: "function",
    group: "reactivity",
    signature: "",
    summary: "Derived.",
    bullets: [],
    example: "",
  },
  {
    id: "active",
    name: "WHEN",
    kind: "value",
    group: "motion",
    signature: "",
    summary: "What plays an animation.",
    bullets: [],
    example: "",
    members: [{ name: "VIEW", summary: "When in view." }],
  },
];

const index = buildKeywordIndex(entries, [
  { id: "animate-reveal", title: "Reveal on scroll", caption: "Each line plays once." },
]);

function chips(parts: ReturnType<typeof tokenize>) {
  return parts.filter((part) => part.chip).map((part) => [part.text, part.target?.id ?? null]);
}

describe("keyword tokenizer", () => {
  test("links an API name to its section", () => {
    expect(chips(tokenize("Call variable() first.", index, "props"))).toEqual([
      ["variable()", "variable"],
    ]);
  });

  test("prefers the longest name", () => {
    expect(chips(tokenize("Use variable.compute() here.", index, "props"))).toEqual([
      ["variable.compute()", "variable-compute"],
    ]);
  });

  test("matches whole words only", () => {
    expect(chips(tokenize("restore() is not variable().", index, "props"))).toEqual([
      ["variable()", "variable"],
    ]);
  });

  test("links an enum member to its parent section", () => {
    expect(chips(tokenize("Pick WHEN.VIEW.", index, "props"))).toEqual([["WHEN.VIEW", "active"]]);
  });

  test("does not link a section to itself", () => {
    expect(chips(tokenize("Call variable() first.", index, "variable"))).toEqual([
      ["variable()", null],
    ]);
  });

  test("backticked text is always a chip, even when unknown", () => {
    expect(chips(tokenize("Set `width` to 3.", index, "props"))).toEqual([["width", null]]);
  });

  test("backticked text links when it names a section", () => {
    expect(chips(tokenize("See `variable()`.", index, "props"))).toEqual([
      ["variable()", "variable"],
    ]);
  });

  test("a demo title links only inside backticks", () => {
    expect(chips(tokenize("See `Reveal on scroll`.", index, "props"))).toEqual([
      ["Reveal on scroll", "animate-reveal"],
    ]);
    expect(chips(tokenize("Reveal on scroll is a word.", index, "props"))).toEqual([]);
  });

  test("curly braces are an expression chip", () => {
    const [, expression] = tokenize("Write {count.value} here.", index, "props");
    expect(expression).toEqual({ text: "{count.value}", chip: true, kind: "expression" });
  });

  test("keeps plain text between chips in order", () => {
    const text = tokenize("A variable() and WHEN.VIEW.", index, "props").map((part) => part.text);
    expect(text.join("")).toBe("A variable() and WHEN.VIEW.");
  });

  test("text without keywords is one plain part", () => {
    expect(tokenize("Nothing here.", index, "props")).toEqual([
      { text: "Nothing here.", chip: false, kind: "text" },
    ]);
  });
});

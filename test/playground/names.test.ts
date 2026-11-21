import { describe, expect, test } from "bun:test";
import { nameProblem } from "../../src/playground/names.ts";

const files = [
  { name: "App.lusia", code: "" },
  { name: "Card.lusia", code: "" },
];

describe("nameProblem", () => {
  test("accepts a new .lusia or .ts name", () => {
    expect(nameProblem("Badge.lusia", files)).toBeUndefined();
    expect(nameProblem("variable-utils.ts", files)).toBeUndefined();
  });

  test("rejects other extensions, folders and odd characters", () => {
    expect(nameProblem("style.css", files)).toBeDefined();
    expect(nameProblem("ui/Badge.lusia", files)).toBeDefined();
    expect(nameProblem("1st.lusia", files)).toBeDefined();
  });

  test("rejects a name that another file has", () => {
    expect(nameProblem("Card.lusia", files)).toBeDefined();
  });

  test("allows a file to keep its own name when renamed", () => {
    expect(nameProblem("Card.lusia", files, "Card.lusia")).toBeUndefined();
  });
});

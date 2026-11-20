import { describe, expect, test } from "bun:test";
import { api } from "../../../reference/api.ts";
import { catalog } from "../catalog.ts";
import { KIND_INFO, KIND_ORDER } from "../reference-model.ts";
import { buildSearchIndex } from "./build.ts";

const index = buildSearchIndex();
const KIND_LABELS = KIND_ORDER.map((kind) => KIND_INFO[kind].label);

describe("search index", () => {
  test("has one entry for every reference entry", () => {
    const reference = index.filter((entry) => entry.page === "Reference");
    const titles = reference.map((entry) => entry.title.text);
    expect([...titles].sort()).toEqual(api.map((entry) => entry.name).sort());
  });

  test("has one Guide entry for every demo in the catalog", () => {
    const demos = Object.values(catalog).flatMap((item) => item.demos ?? []);
    const guideDemos = index.filter((entry) => entry.page === "Guide" && entry.href.includes("#"));
    for (const demo of demos) {
      expect(guideDemos.some((entry) => entry.href.endsWith(`#${demo.id}`))).toBe(true);
    }
  });

  test("links every entry to its page and anchor", () => {
    for (const entry of index) {
      expect(entry.href).toMatch(/^\/(guide|reference|playground)(#.+)?$/);
    }
  });

  test("gives every entry a title, an icon and a section", () => {
    for (const entry of index) {
      expect(entry.title.text.length).toBeGreaterThan(0);
      expect(entry.icon).toMatch(/^[a-z0-9_]+$/);
      expect(entry.section.length).toBeGreaterThan(0);
    }
  });

  test("labels every Reference result with one of the kind sections", () => {
    const reference = index.filter((entry) => entry.page === "Reference");
    for (const entry of reference) expect(KIND_LABELS).toContain(entry.section);
  });

  test("includes the playground page", () => {
    expect(index.some((entry) => entry.page === "Playground" && entry.href === "/playground")).toBe(
      true,
    );
  });

  test("variables lower-case copies for matching", () => {
    for (const entry of index) {
      expect(entry.title.lower).toBe(entry.title.text.toLowerCase());
    }
  });
});

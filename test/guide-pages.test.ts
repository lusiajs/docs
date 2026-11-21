import { describe, expect, test } from "bun:test";
import { guidePages } from "../src/guide-pages.ts";
import { buildDemo } from "../src/live/demo-build.ts";

function exampleOf(id: string): string {
  const page = guidePages.find((entry) => entry.id === id);
  if (!page) throw new Error(`No guide page "${id}"`);
  return page.example;
}

function expectBuilds(code: string): void {
  const result = buildDemo([{ name: "src/sample/Sample.lusia", code }]);
  if (!result.bundle) throw new Error(`${result.errors[0]?.message} (${result.errors[0]?.file})`);
  expect(result.bundle.entries.length).toBeGreaterThan(0);
}

describe("Guide page samples", () => {
  test("the What is Lusia sample is a whole component", () => {
    expectBuilds(exampleOf("lusia-intro"));
  });

  test("the Lifecycle sample compiles inside a component", () => {
    expectBuilds(`${exampleOf("lifecycle")}\n\n<p>Sample</p>`);
  });
});

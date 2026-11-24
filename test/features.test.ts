import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { featureSources, features } from "../src/features.ts";

const FEATURE_DIR = "src/components/features";

describe("Home features", () => {
  test("there are seven features in order", () => {
    expect(features.map((feature) => feature.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
    ]);
    expect(features.map((feature) => feature.key)).toEqual([
      "motion",
      "scroll",
      "updates",
      "flow",
      "tree",
      "scoped",
      "start",
    ]);
    expect(Object.keys(featureSources).sort()).toEqual(
      features.map((feature) => feature.key).sort(),
    );
  });

  test.each(Object.entries(featureSources))("%s shows its demo's real source", (_, source) => {
    const onDisk = readFileSync(`${FEATURE_DIR}/${source.file}`, "utf8");
    expect(source.code).toBe(onDisk);
  });
});

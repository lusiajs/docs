import { describe, expect, test } from "bun:test";
import { learnOf } from "./guide-learn.ts";
import { isGuideEntry, placedRows, placeGroups } from "./guide-placement.ts";

const groups = placeGroups(isGuideEntry);

describe("guide learn lines", () => {
  test.each(placedRows(groups).map((row) => [row.entry.id] as const))(
    "%s has a what you will learn line",
    (id) => {
      expect(learnOf(id)).not.toBeNull();
    },
  );

  test.each(groups.map((group) => [group.label, group.intro] as const))(
    "%s has a group overview",
    (_label, intro) => {
      expect(intro.length).toBeGreaterThan(0);
    },
  );
});

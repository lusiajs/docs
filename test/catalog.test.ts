import { describe, expect, test } from "bun:test";
import { api } from "../../reference/api.ts";
import { entryIcon } from "../src/catalog.ts";

const ICON_NAME = /^[a-z0-9_]+$/;
const CHEVRON_OR_ARROW = /chevron|arrow/;

describe("catalog icons", () => {
  test.each(api.map((entry) => [entry.name, entry.id]))("%s has a real icon", (_name, id) => {
    const icon = entryIcon(id);
    expect(icon).toMatch(ICON_NAME);
    expect(icon).not.toMatch(CHEVRON_OR_ARROW);
  });
});

import { describe, expect, test } from "bun:test";
import { CODES } from "lusiajs/errors/codes.ts";

const PAGE = new URL("../../src/pages/Errors.lusia", import.meta.url).pathname;

describe("site Errors page", () => {
  test("reads the code table and renders every field", async () => {
    const source = await Bun.file(PAGE).text();
    expect(source).toContain('from "lusiajs/errors/codes.ts"');
    expect(source).toContain("<EACH {groups} as={group}>");
    expect(source).toContain("<EACH {group.codes} as={code}>");
    expect(source).toContain("{code.id}");
    expect(source).toContain("{code.message}");
    expect(source).toContain("{code.hint}");
  });

  test("covers all three code ranges", () => {
    const ids = Object.keys(CODES);
    expect(ids.length).toBeGreaterThan(0);
    for (const prefix of ["L1", "L2", "L3"]) {
      expect(ids.some((id) => id.startsWith(prefix))).toBe(true);
    }
  });
});

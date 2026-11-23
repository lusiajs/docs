import { describe, expect, test } from "bun:test";
import { nextIndex } from "./tab-keys.ts";

describe("nextIndex", () => {
	test("moves right and wraps at the end", () => {
		expect(nextIndex("ArrowRight", 1, 3)).toBe(2);
		expect(nextIndex("ArrowRight", 2, 3)).toBe(0);
	});

	test("moves left and wraps at the start", () => {
		expect(nextIndex("ArrowLeft", 1, 3)).toBe(0);
		expect(nextIndex("ArrowLeft", 0, 3)).toBe(2);
	});

	test("Home and End jump to the ends", () => {
		expect(nextIndex("Home", 2, 3)).toBe(0);
		expect(nextIndex("End", 0, 3)).toBe(2);
	});

	test("other keys return null", () => {
		expect(nextIndex("Enter", 0, 3)).toBeNull();
	});
});

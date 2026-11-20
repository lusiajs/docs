import { describe, expect, test } from "bun:test";
import { withRecent } from "./recent.ts";

describe("withRecent", () => {
	test("puts the newest term first", () => {
		expect(withRecent(["bind-value"], "variable")).toEqual([
			"variable",
			"bind-value",
		]);
	});

	test("moves a repeated term to the front without duplicating it", () => {
		expect(withRecent(["bind-value", "variable"], "variable")).toEqual([
			"variable",
			"bind-value",
		]);
	});

	test("keeps only the last five terms", () => {
		const list = ["a", "b", "c", "d", "e"];
		expect(withRecent(list, "f")).toEqual(["f", "a", "b", "c", "d"]);
	});
});

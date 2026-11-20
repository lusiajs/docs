import { describe, expect, test } from "bun:test";
import { field, matchToken, mergeRanges, toParts } from "./fuzzy.ts";

describe("matchToken", () => {
	test("scores an exact match highest, then a prefix, a word start and a substring", () => {
		const exact = matchToken(field("store"), "store")!.score;
		const prefix = matchToken(field("store.from"), "store")!.score;
		const wordStart = matchToken(field("use store"), "store")!.score;
		const inside = matchToken(field("restore"), "store")!.score;
		expect(exact).toBeGreaterThan(prefix);
		expect(prefix).toBeGreaterThan(wordStart);
		expect(wordStart).toBeGreaterThan(inside);
	});

	test("matches letters in order as a fuzzy fallback", () => {
		const hit = matchToken(field("store.from()"), "stf");
		expect(hit).toBeDefined();
		expect(hit!.ranges).toEqual([
			[0, 2],
			[6, 7],
		]);
	});

	test("rejects letters that are too far apart", () => {
		expect(
			matchToken(field("a------------------b"), "ab"),
		).toBeUndefined();
	});

	test("ignores case", () => {
		expect(matchToken(field("EACH"), "each")!.ranges).toEqual([[0, 4]]);
	});

	test("misses when a letter is absent", () => {
		expect(matchToken(field("store"), "zz")).toBeUndefined();
	});
});

describe("mergeRanges and toParts", () => {
	test("joins touching and overlapping ranges", () => {
		expect(
			mergeRanges([
				[4, 6],
				[0, 2],
				[2, 3],
				[5, 8],
			]),
		).toEqual([
			[0, 3],
			[4, 8],
		]);
	});

	test("cuts text into matched and plain parts", () => {
		expect(toParts("store()", [[0, 5]])).toEqual([
			{ text: "store", hit: true },
			{ text: "()", hit: false },
		]);
	});

	test("returns one plain part with no ranges", () => {
		expect(toParts("abc", [])).toEqual([{ text: "abc", hit: false }]);
	});
});

import { describe, expect, test } from "bun:test";
import { api, type ApiGroup } from "lusiajs/api";
import { catalog } from "./catalog.ts";
import { guidePages } from "./guide-pages.ts";
import { isGuideEntry, placedRows, placeGroups } from "./guide-placement.ts";

const GROUP_ORDER: ApiGroup[] = [
	"basics",
	"reactivity",
	"events",
	"flow",
	"components",
	"styling",
	"motion",
];

const MOTION_SUBGROUP_ORDER = [
	"motion-first-animation",
	"motion-timing",
	"motion-configuration",
	"motion-triggers",
	"motion-runtime",
	"motion-scroll",
	"motion-layout",
	"motion-advanced",
];

const MAX_DEMOS_PER_ENTRY = 6;

function placedIds(): string[] {
	return placedRows(placeGroups()).map((row) => row.entry.id);
}

describe("guide order", () => {
	test("groups follow the learning path", () => {
		expect(placeGroups().map((group) => group.group)).toEqual(
			GROUP_ORDER,
		);
	});

	test("motion sub-groups follow the learning path", () => {
		const motion = placeGroups().find(
			(group) => group.group === "motion",
		)!;
		expect(motion.blocks.map((block) => block.id)).toEqual(
			MOTION_SUBGROUP_ORDER,
		);
	});

	test("every api entry is placed exactly once", () => {
		expect([...placedIds()].sort()).toEqual(
			[...api, ...guidePages].map((entry) => entry.id).sort(),
		);
	});

	test("every entry sits in the group its api entry names", () => {
		for (const row of placedRows(placeGroups())) {
			expect(row.group.group, row.entry.id).toBe(row.entry.group);
		}
	});

	test("the Guide leaves out type entries and keeps every other one once", () => {
		const guideIds = placedRows(placeGroups(isGuideEntry)).map(
			(row) => row.entry.id,
		);
		const expected = [...api, ...guidePages]
			.filter((entry) => entry.kind !== "type")
			.map((entry) => entry.id);
		expect([...guideIds].sort()).toEqual(expected.sort());
	});

	test("every sub-group has entries", () => {
		for (const group of placeGroups()) {
			for (const block of group.blocks)
				expect(block.entries.length, block.id).toBeGreaterThan(0);
		}
	});
});

describe("guide demos", () => {
	test("every demo is hosted by a Guide entry and appears once", () => {
		const guideIds = new Set(
			placedRows(placeGroups(isGuideEntry)).map((row) => row.entry.id),
		);
		const demoIds: string[] = [];
		for (const [hostId, entry] of Object.entries(catalog)) {
			if (entry.demos?.length)
				expect(guideIds.has(hostId), hostId).toBe(true);
			for (const demo of entry.demos ?? []) demoIds.push(demo.id);
		}
		expect(new Set(demoIds).size).toBe(demoIds.length);
	});

	test("no entry has more demos than the sub-nav can hold", () => {
		for (const [id, entry] of Object.entries(catalog)) {
			expect(entry.demos?.length ?? 0, id).toBeLessThanOrEqual(
				MAX_DEMOS_PER_ENTRY,
			);
		}
	});

	test("demo titles are plain words, without a ON or ATTACH suffix", () => {
		for (const entry of Object.values(catalog)) {
			for (const demo of entry.demos ?? []) {
				expect(demo.title, demo.id).not.toMatch(/\(ON\./);
			}
		}
	});
});

import { describe, expect, test } from "bun:test";
import { guideSidebar } from "./render.ts";

describe("guideSidebar", () => {
	test("every entry and demo link names the Guide page before its hash", () => {
		const links = guideSidebar.flatMap((group) =>
			group.blocks.flatMap((block) =>
				block.entries.flatMap((entry) => [
					entry.href,
					...entry.demos.map((demo) => demo.href),
				]),
			),
		);
		expect(links.length).toBeGreaterThan(0);
		for (const href of links) expect(href).toMatch(/^\/guide#[\w-]+$/);
	});
});

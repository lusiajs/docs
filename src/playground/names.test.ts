import { describe, expect, test } from "bun:test";
import { ENTRY_FILE, nameProblem } from "./names.ts";
import type { PlayFile } from "./types.ts";

const files: PlayFile[] = [
	{ name: ENTRY_FILE, code: "" },
	{ name: "Card.lusia", code: "" },
];

describe("nameProblem", () => {
	test("accepts a new .lusia or .ts name", () => {
		expect(nameProblem("Button.lusia", files)).toBeUndefined();
		expect(nameProblem("utils_2-x.ts", files)).toBeUndefined();
	});

	test("asks for a name when the field is empty", () => {
		expect(nameProblem("", files)).toBe("Type a file name first.");
	});

	test("rejects an unsupported file type", () => {
		expect(nameProblem("Card.css", files)).toBe(
			"The file type must be .lusia or .ts.",
		);
		expect(nameProblem("Card", files)).toBe(
			"The file type must be .lusia or .ts.",
		);
	});

	test("rejects a base name with invalid characters", () => {
		const problem = "Start with a letter. Then use letters, digits, - or _.";
		expect(nameProblem("1Card.lusia", files)).toBe(problem);
		expect(nameProblem("my card.lusia", files)).toBe(problem);
		expect(nameProblem(".lusia", files)).toBe(problem);
	});

	test("rejects a name that already exists", () => {
		expect(nameProblem("Card.lusia", files)).toBe(
			"A file with this name already exists.",
		);
	});

	test("keeps the current name of a file being renamed", () => {
		expect(nameProblem("Card.lusia", files, "Card.lusia")).toBeUndefined();
	});
});

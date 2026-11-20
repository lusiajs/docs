import { afterEach, describe, expect, test } from "bun:test";
import { addFile, jumpTo, resetFiles, selectFile } from "./actions.ts";
import { ENTRY_FILE } from "./names.ts";
import { starterFiles } from "./starter.ts";
import { active, files, jump, view } from "./state.ts";

function openPreview(): void {
	view.value = "preview";
}

afterEach(() => {
	resetFiles();
	jump.value = null;
});

describe("selectFile", () => {
	test("opens the code view for the selected file", () => {
		addFile("Extra.lusia");
		openPreview();
		selectFile(ENTRY_FILE);
		expect(active.value).toBe(ENTRY_FILE);
		expect(view.value).toBe("code");
	});
});

describe("jumpTo", () => {
	test("opens the code view at the error location", () => {
		openPreview();
		jumpTo({ file: ENTRY_FILE, line: 2, message: "x" });
		expect(active.value).toBe(ENTRY_FILE);
		expect(view.value).toBe("code");
		expect(jump.value).toEqual({ file: ENTRY_FILE, line: 2, column: 1 });
	});
});

describe("addFile", () => {
	test("adds the file and opens the code view", () => {
		openPreview();
		expect(addFile("Extra.lusia")).toBeUndefined();
		expect(active.value).toBe("Extra.lusia");
		expect(view.value).toBe("code");
		expect(files.value.find((file) => file.name === "Extra.lusia")).toEqual({
			name: "Extra.lusia",
			code: "",
		});
	});

	test("returns a problem for an invalid name and keeps the view", () => {
		openPreview();
		const problem = addFile("not a name");
		expect(typeof problem).toBe("string");
		expect(files.value).toEqual(starterFiles());
		expect(active.value).toBe(ENTRY_FILE);
		expect(view.value).toBe("preview");
	});
});

describe("resetFiles", () => {
	test("restores the starter files on the entry file in the code view", () => {
		files.value = [{ name: "Scratch.ts", code: "const a = 1;" }];
		active.value = "Scratch.ts";
		openPreview();
		resetFiles();
		expect(files.value).toEqual(starterFiles());
		expect(active.value).toBe(ENTRY_FILE);
		expect(view.value).toBe("code");
	});
});

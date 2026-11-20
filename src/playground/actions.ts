import type { LiveError } from "../live/types.ts";
import { ENTRY_FILE, nameProblem } from "./names.ts";
import { starterFiles } from "./starter.ts";
import { active, files, jump, notice, view } from "./state.ts";
import type { PlayFile } from "./types.ts";

const FORMAT_FAILED = "Could not format this file. Fix the syntax first.";

export function selectFile(name: string): void {
	active.value = name;
	view.value = "code";
}

export function changeCode(name: string, code: string): void {
	files.value = files
		.peek()
		.map((file) => (file.name === name ? { ...file, code } : file));
}

/** Adds an empty file and opens it. Returns the problem with the name, or undefined when added. */
export function addFile(name: string): string | undefined {
	const problem = nameProblem(name, files.peek());
	if (problem) return problem;
	files.value = [...files.peek(), { name, code: "" }];
	active.value = name;
	view.value = "code";
	return undefined;
}

/** Renames the active file. The entry file keeps its name. */
export function renameActive(name: string): string | undefined {
	const current = active.peek();
	if (current === ENTRY_FILE) return "The entry file keeps its name.";
	const problem = nameProblem(name, files.peek(), current);
	if (problem) return problem;
	files.value = files
		.peek()
		.map((file) => (file.name === current ? { ...file, name } : file));
	active.value = name;
	return undefined;
}

/** Removes the active file. The entry file cannot be removed. */
export function deleteActive(): void {
	const current = active.peek();
	if (current === ENTRY_FILE) return;
	files.value = files.peek().filter((file) => file.name !== current);
	active.value = ENTRY_FILE;
}

export function resetFiles(): void {
	files.value = starterFiles();
	active.value = ENTRY_FILE;
	view.value = "code";
	notice.value = "";
}

export function jumpTo(error: LiveError): void {
	if (!error.file) return;
	active.value = error.file;
	view.value = "code";
	jump.value = {
		file: error.file,
		line: error.line ?? 1,
		column: error.column ?? 1,
	};
}

/** Formats the active file with the editor's formatter. Its code is loaded on first use. */
export async function formatActive(): Promise<void> {
	const file = activeFile();
	if (!file) return;
	const { formatFile } = await import("../editor/format-file.ts");
	try {
		const formatted = await formatFile(file.name, file.code);
		changeCode(file.name, formatted);
		view.value = "code";
		notice.value = "";
	} catch {
		notice.value = FORMAT_FAILED;
	}
}

function activeFile(): PlayFile | undefined {
	return files.peek().find((file) => file.name === active.peek());
}

import { copyText } from "../copy.ts";
import type { LiveError } from "../live/types.ts";
import { ENTRY_FILE, nameProblem } from "./names.ts";
import { PRESETS, type Preset } from "./presets/index.ts";
import { starterFiles } from "./starter.ts";
import { active, files, jump, notice, view } from "./state.ts";
import type { PlayFile } from "./types.ts";

const FORMAT_FAILED = "Could not format this file. Fix the syntax first.";

export function selectFile(name: string): void {
  active.value = name;
  view.value = "code";
}

export function changeCode(name: string, code: string): void {
  files.value = files.peek().map((file) => (file.name === name ? { ...file, code } : file));
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
  files.value = files.peek().map((file) => (file.name === current ? { ...file, name } : file));
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
  showFiles(starterFiles());
}

/** Replaces every file with a preset's files and opens its entry file. */
export function loadPreset(preset: Preset): void {
  showFiles(preset.files.map((file) => ({ ...file })));
}

/** True when the files are not exactly one preset, so loading a preset would lose work. */
export function hasEditedFiles(): boolean {
  const current = files.peek();
  return !PRESETS.some((preset) => sameFiles(preset.files, current));
}

function showFiles(next: PlayFile[]): void {
  files.value = next;
  active.value = ENTRY_FILE;
  view.value = "code";
  notice.value = "";
}

function sameFiles(left: readonly PlayFile[], right: readonly PlayFile[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (file, index) => file.name === right[index]?.name && file.code === right[index]?.code,
    )
  );
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

/** Copies the active file's code. Resolves to false when the browser refuses. */
export function copyActive(): Promise<boolean> {
  return copyText(activeFile()?.code ?? "");
}

function activeFile(): PlayFile | undefined {
  return files.peek().find((file) => file.name === active.peek());
}

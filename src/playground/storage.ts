import { ENTRY_FILE } from "./names.ts";
import { starterFiles } from "./starter.ts";
import type { PlayFile } from "./types.ts";

// The files are kept in this browser only, so a reload keeps the user's work.
const KEY = "lusia-playground-files";

export function loadFiles(): PlayFile[] {
  const saved = readSaved();
  return saved && saved.some((file) => file.name === ENTRY_FILE) ? saved : starterFiles();
}

export function saveFiles(files: readonly PlayFile[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(files));
  } catch {
    // Private windows and full storage: the files still work for this visit.
  }
}

function readSaved(): PlayFile[] | undefined {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return Array.isArray(parsed) && parsed.every(isPlayFile) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isPlayFile(value: unknown): value is PlayFile {
  const file = value as Partial<PlayFile> | null;
  return typeof file?.name === "string" && typeof file.code === "string";
}

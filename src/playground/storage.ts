import { ENTRY_FILE } from "./names.ts";
import { starterFiles } from "./starter.ts";
import type { PlayFile } from "./types.ts";

// The files are kept in this browser only, so a reload keeps the user's work.
const KEY = "lusia-playground-files";

// Matches the module name after from, import or import( when it is "lusia" or a "lusia/..." subpath.
const LUSIA_SPECIFIER = /((?:\bfrom|\bimport)\s*\(?\s*)(["'])lusia((?:\/[^"']*)?)\2/g;

export function loadFiles(): PlayFile[] {
  const saved = readSaved();
  if (!saved || !saved.some((file) => file.name === ENTRY_FILE)) {
    return starterFiles();
  }
  const migrated = saved.map(migrateFile);
  if (migrated.some((file, index) => file.code !== saved[index]?.code)) {
    saveFiles(migrated);
  }
  return migrated;
}

export function saveFiles(files: readonly PlayFile[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(files));
  } catch {
    // Private windows and full storage: the files still work for this visit.
  }
}

/** Rewrites imports from the old "lusia" package name to "lusiajs". */
export function migrateImports(code: string): string {
  return code.replace(
    LUSIA_SPECIFIER,
    (_match, lead: string, quote: string, subpath: string) =>
      `${lead}${quote}lusiajs${subpath}${quote}`,
  );
}

function migrateFile(file: PlayFile): PlayFile {
  return { ...file, code: migrateImports(file.code) };
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

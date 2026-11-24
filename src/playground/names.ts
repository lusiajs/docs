import type { PlayFile } from "./types.ts";

export const ENTRY_FILE = "App.lusia";

/** The file types the playground compiles. The new-file form lists them. */
export const FILE_TYPES: readonly string[] = [".lusia", ".ts"];

const BASE_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

function fileTypeOf(name: string): string | undefined {
  return FILE_TYPES.find((type) => name.endsWith(type));
}

/** Why a file name cannot be used, or undefined when it can. `current` is the name the file has now. */
export function nameProblem(
  name: string,
  files: readonly PlayFile[],
  current?: string,
): string | undefined {
  if (name === "") return "Type a file name first.";
  const type = fileTypeOf(name);
  if (type === undefined) return "The file type must be .lusia or .ts.";
  if (!BASE_PATTERN.test(name.slice(0, -type.length))) {
    return "Start with a letter. Then use letters, digits, - or _.";
  }
  if (name !== current && files.some((file) => file.name === name)) {
    return "A file with this name already exists.";
  }
  return undefined;
}

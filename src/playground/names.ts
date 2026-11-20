import type { PlayFile } from "./types.ts";

export const ENTRY_FILE = "App.lucia";

const NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*\.(lucia|ts)$/;

/** Why a file name cannot be used, or undefined when it can. `current` is the name the file has now. */
export function nameProblem(
  name: string,
  files: readonly PlayFile[],
  current?: string,
): string | undefined {
  if (!NAME_PATTERN.test(name)) return "Use letters, digits, - or _, then .lucia or .ts.";
  if (name !== current && files.some((file) => file.name === name)) {
    return "A file with this name already exists.";
  }
  return undefined;
}

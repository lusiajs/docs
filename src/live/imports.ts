import { resolveName, type EditorFile } from "../editor/files.ts";

/** The prefix of a live module name in the frame's import map. */
export const MODULE_PREFIX = "@live/";

// Matches `from "./Name"` and `import("../Name")`. Specifiers are resolved against the importing file.
const RELATIVE_IMPORT = /(\bfrom\s*|\bimport\s*\(\s*)(["'])(\.\.?\/[^"'\n]+)\2/g;

export interface BrokenImport {
  specifier: string;
  line: number;
}

/** The imports in `fromName` that name no file in `names`. Lines start at 1. */
export function findBrokenImports(
  source: string,
  fromName: string,
  names: ReadonlySet<string>,
): BrokenImport[] {
  const broken: BrokenImport[] = [];
  for (const match of source.matchAll(RELATIVE_IMPORT)) {
    const specifier = match[3] ?? "";
    if (names.has(resolveName(fromName, specifier))) continue;
    const line = source.slice(0, match.index).split("\n").length;
    broken.push({ specifier, line });
  }
  return broken;
}

/** Points each import of `fromName` at the module name of the file it names. Other imports are kept. */
export function linkImports(code: string, fromName: string, names: ReadonlySet<string>): string {
  return code.replace(RELATIVE_IMPORT, (whole, lead: string, quote: string, specifier: string) => {
    const target = resolveName(fromName, specifier);
    return names.has(target) ? `${lead}${quote}${MODULE_PREFIX}${target}${quote}` : whole;
  });
}

/** The .lusia files that no other file imports. A file importing itself does not count. */
export function rootNames(files: readonly EditorFile[]): string[] {
  const imported = new Set<string>();
  for (const file of files) {
    for (const match of file.code.matchAll(RELATIVE_IMPORT)) {
      const target = resolveName(file.name, match[3] ?? "");
      if (target !== file.name) imported.add(target);
    }
  }
  return files
    .filter((file) => file.name.endsWith(".lusia") && !imported.has(file.name))
    .map((file) => file.name);
}

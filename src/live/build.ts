import {
  cleanSyntaxMessage,
  compileForBrowser,
  LusiaError,
  stripTypes,
} from "@compiler/browser.ts";
import { plainFrame } from "@compiler/errors/frame.ts";
import type { EditorFile } from "../editor/files.ts";
import { findBrokenImports, linkImports, rootNames } from "./imports.ts";
import { scssImporter } from "./scss.ts";
import type { LiveBundle, LiveError } from "./types.ts";

export interface BuildOptions {
  /** Module names to mount. Default: the .lusia files that no other file imports. */
  entries?: string[];
  /** CSS for the frame. Default: none. */
  styles?: string;
}

export interface BuildResult {
  /** Set only when every file compiled and every import resolves. */
  bundle?: LiveBundle;
  errors: LiveError[];
}

// Compiles every file with the browser compiler and removes the TypeScript. Errors are collected per file.
export function buildLive(files: readonly EditorFile[], options: BuildOptions = {}): BuildResult {
  const names = new Set(files.map((file) => file.name));
  const project = new Map(files.map((file) => [file.name, file.code]));
  const entries = options.entries ?? rootNames(files);
  const errors: LiveError[] = entries
    .filter((entry) => !names.has(entry))
    .map((entry) => ({ message: `${entry} is missing.` }));
  const modules: Record<string, string> = {};
  for (const file of files.filter(isModule)) {
    errors.push(
      ...findBrokenImports(file.code, file.name, names).map((item) => brokenError(file.name, item)),
    );
    try {
      const code = compileFile(file, project);
      modules[file.name] = linkImports(code, file.name, names);
    } catch (error) {
      errors.push(toLiveError(error, file.name, file.code));
    }
  }
  if (errors.length > 0) return { errors };
  return { bundle: { entries, modules, styles: options.styles ?? "" }, errors };
}

// Other files, such as .scss partials, are only read by the Sass importer.
function isModule(file: EditorFile): boolean {
  return file.name.endsWith(".lusia") || file.name.endsWith(".ts");
}

function compileFile(file: EditorFile, project: ReadonlyMap<string, string>): string {
  if (file.name.endsWith(".lusia")) {
    const importers = [scssImporter(file.name, project)];
    return compileForBrowser(file.code, file.name, { importers }).code;
  }
  return stripTypes(file.code, file.name);
}

function brokenError(file: string, item: { specifier: string; line: number }): LiveError {
  return {
    message: `Cannot find ${item.specifier}.`,
    hint: "Import a file from this list, using its full name, such as ./Card.lusia.",
    file,
    line: item.line,
  };
}

function toLiveError(error: unknown, file: string, source: string): LiveError {
  if (error instanceof LusiaError) {
    return {
      message: error.message,
      code: error.code,
      hint: error.hint,
      file,
      line: error.line,
      column: error.column,
      frame: frameOf(error, source),
    };
  }
  const loc = syntaxLocation(error);
  if (loc) {
    return { message: cleanSyntaxMessage(loc.message), file, line: loc.line, column: loc.column };
  }
  return { message: error instanceof Error ? error.message : String(error), file };
}

function frameOf(error: LusiaError, source: string): string | undefined {
  if (error.line === undefined) return undefined;
  return plainFrame(source, error.line, error.column, error.length);
}

// A .ts file's syntax error from sucrase carries its position in `loc`.
function syntaxLocation(
  error: unknown,
): { message: string; line: number; column: number } | undefined {
  if (!(error instanceof SyntaxError)) return undefined;
  const loc = (error as { loc?: { line: number; column: number } }).loc;
  return loc ? { message: error.message, line: loc.line, column: loc.column } : undefined;
}

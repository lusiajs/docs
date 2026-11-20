import { LuciaError } from "../../../src/compiler/errors.ts";
import { formatWhere } from "../../../src/compiler/errors/where.ts";
import { compileWithoutStyles } from "./compile-check.ts";
import { errorPosition } from "./error-position.ts";
import { typescriptLanguage } from "./lang/language.ts";
import { lintLucia, type LintIssue } from "./lint.ts";
import type { PropDef } from "./props.ts";
import { scriptSection } from "./sections.ts";

export interface EditorDiagnostic {
  /** 1-based. */
  line: number;
  /** 1-based. */
  column: number;
  /** Characters to mark from the column. Undefined marks to the end of the line. */
  length?: number;
  severity: "error" | "warning";
  /** "lucia" for compile errors, "lucia-lint" for warnings. */
  source: "lucia" | "lucia-lint";
  message: string;
  /** The LuciaError code, such as L1003, or the lint code, such as unused-import. */
  code?: string;
  hint?: string;
  /** file:line:column, as the build prints it. */
  where: string;
}

export type ChildPropsLookup = (name: string) => PropDef[] | undefined;

/**
 * Compile errors, TypeScript syntax errors and lint warnings for a .lucia or .ts source,
 * with 1-based positions. The compiler does not parse TypeScript, so syntax is checked here.
 */
export function diagnosticsFor(
  source: string,
  file: string,
  childProps: ChildPropsLookup,
): EditorDiagnostic[] {
  return [
    ...compileDiagnostics(source, file),
    ...syntaxDiagnostics(source, file),
    ...lintDiagnostics(source, file, childProps),
  ];
}

function syntaxDiagnostics(source: string, file: string): EditorDiagnostic[] {
  const script = file.endsWith(".ts") ? { code: source, offset: 0 } : scriptCode(source);
  if (!script) return [];
  const tree = typescriptLanguage.language.parser.parse(script.code);
  const found: EditorDiagnostic[] = [];
  tree.iterate({
    enter(node) {
      if (!node.type.isError) return;
      const offset = script.offset + node.from;
      found.push(syntaxDiagnostic(source, offset, file));
    },
  });
  return found;
}

function scriptCode(source: string): { code: string; offset: number } | undefined {
  const section = scriptSection(source);
  if (!section) return undefined;
  return {
    code: source.slice(section.contentStart, section.contentEnd),
    offset: section.contentStart,
  };
}

function syntaxDiagnostic(source: string, offset: number, file: string): EditorDiagnostic {
  const before = source.slice(0, offset);
  const line = before.split("\n").length;
  const column = offset - before.lastIndexOf("\n");
  return {
    line,
    column,
    severity: "error",
    source: "lucia",
    message: "Syntax error in the script",
    code: "syntax",
    where: formatWhere(file, line, column),
  };
}

function compileDiagnostics(source: string, file: string): EditorDiagnostic[] {
  try {
    compileWithoutStyles(source, file);
    return [];
  } catch (error) {
    return [compileDiagnostic(error, file)];
  }
}

function compileDiagnostic(error: unknown, file: string): EditorDiagnostic {
  const { line, column, message } = errorPosition(error);
  const luciaError = error instanceof LuciaError ? error : undefined;
  return {
    line,
    column,
    length: luciaError?.length,
    severity: "error",
    source: "lucia",
    message,
    code: luciaError?.code,
    hint: luciaError?.hint,
    where: formatWhere(file, line, column),
  };
}

function lintDiagnostics(
  source: string,
  file: string,
  childProps: ChildPropsLookup,
): EditorDiagnostic[] {
  return lintLucia(source, childProps).map((issue) => lintDiagnostic(issue, file));
}

function lintDiagnostic(issue: LintIssue, file: string): EditorDiagnostic {
  return {
    line: issue.line,
    column: issue.column,
    severity: issue.severity,
    source: "lucia-lint",
    message: issue.message,
    code: issue.code,
    where: formatWhere(file, issue.line, issue.column),
  };
}

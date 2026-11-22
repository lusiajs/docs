import { lintLusia, type LintIssue } from "lusiajs/language/lint/lint.ts";
import type { PropDef } from "lusiajs/language/parse/props.ts";
import { scriptSection } from "lusiajs/language/parse/sections.ts";
import { errorPosition } from "lusiajs/editor/error-position.ts";
import { LusiaError } from "lusiajs/errors/error.ts";
import { formatWhere } from "lusiajs/errors/where.ts";
import { compileWithoutStyles } from "./compile-check.ts";
import { typescriptLanguage } from "./lang/language.ts";
import { WRONG_LUSIA_IMPORT_MESSAGE, wrongLusiaImports } from "./import-check.ts";

export interface EditorDiagnostic {
	/** 1-based. */
	line: number;
	/** 1-based. */
	column: number;
	/** Characters to mark from the column. Undefined marks to the end of the line. */
	length?: number;
	severity: "error" | "warning";
	/** "lusia" for compile errors, "lusia-lint" for warnings. */
	source: "lusia" | "lusia-lint";
	message: string;
	/** The LusiaError code, such as L1003, or the lint code, such as unused-import. */
	code?: string;
	hint?: string;
	/** file:line:column, as the build prints it. */
	where: string;
}

export type ChildPropsLookup = (name: string) => PropDef[] | undefined;

/**
 * Compile errors, TypeScript syntax errors and lint warnings for a .lusia or .ts source,
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
		...importDiagnostics(source, file),
		...lintDiagnostics(source, file, childProps),
	];
}

function syntaxDiagnostics(source: string, file: string): EditorDiagnostic[] {
	const script = scriptFor(source, file);
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

function importDiagnostics(source: string, file: string): EditorDiagnostic[] {
	const script = scriptFor(source, file);
	if (!script) return [];
	return wrongLusiaImports(script.code).map((specifier) =>
		importDiagnostic(source, script.offset + specifier.from, specifier.to - specifier.from, file),
	);
}

function scriptFor(
	source: string,
	file: string,
): { code: string; offset: number } | undefined {
	if (file.endsWith(".ts")) return { code: source, offset: 0 };
	return scriptCode(source);
}

function scriptCode(
	source: string,
): { code: string; offset: number } | undefined {
	const section = scriptSection(source);
	if (!section) return undefined;
	return {
		code: source.slice(section.contentStart, section.contentEnd),
		offset: section.contentStart,
	};
}

function syntaxDiagnostic(
	source: string,
	offset: number,
	file: string,
): EditorDiagnostic {
	const { line, column } = positionAt(source, offset);
	return {
		line,
		column,
		severity: "error",
		source: "lusia",
		message: "Syntax error in the script",
		code: "syntax",
		where: formatWhere(file, line, column),
	};
}

function importDiagnostic(
	source: string,
	offset: number,
	length: number,
	file: string,
): EditorDiagnostic {
	const { line, column } = positionAt(source, offset);
	return {
		line,
		column,
		length,
		severity: "error",
		source: "lusia",
		message: WRONG_LUSIA_IMPORT_MESSAGE,
		code: "wrong-import",
		where: formatWhere(file, line, column),
	};
}

function positionAt(
	source: string,
	offset: number,
): { line: number; column: number } {
	const before = source.slice(0, offset);
	return {
		line: before.split("\n").length,
		column: offset - before.lastIndexOf("\n"),
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
	const lusiaError = error instanceof LusiaError ? error : undefined;
	return {
		line,
		column,
		length: lusiaError?.length,
		severity: "error",
		source: "lusia",
		message,
		code: lusiaError?.code,
		hint: lusiaError?.hint,
		where: formatWhere(file, line, column),
	};
}

function lintDiagnostics(
	source: string,
	file: string,
	childProps: ChildPropsLookup,
): EditorDiagnostic[] {
	return lintLusia(source, childProps).map((issue) =>
		lintDiagnostic(issue, file),
	);
}

function lintDiagnostic(issue: LintIssue, file: string): EditorDiagnostic {
	return {
		line: issue.line,
		column: issue.column,
		severity: issue.severity,
		source: "lusia-lint",
		message: issue.message,
		code: issue.code,
		where: formatWhere(file, issue.line, issue.column),
	};
}

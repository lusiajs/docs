import { splitImports } from "lusia/compiler/parse/imports.ts";
import { parse } from "lusia/compiler/parse/sections.ts";
import { compileTemplate } from "lusia/compiler/template/scan/scanner.ts";
import { scriptRange } from "lusia/compiler/template/check/script-range.ts";
import { generate } from "lusia/compiler/template/codegen/generate.ts";

/**
 * The compiler's script, markup and codegen steps, as `compile()` runs them.
 * Styles are skipped: Sass does not run in the browser, so style errors are not reported here.
 * Throws the same LusiaError the build would throw.
 */
export function compileWithoutStyles(source: string, file: string): void {
	const parsed = parse(source, file);
	const { imports, body, components } = splitImports(parsed.script, file);
	const template = compileTemplate(
		parsed.markup,
		file,
		parsed.markupLine,
		components,
	);
	generate({
		imports,
		body,
		bodyLine: parsed.script?.line ?? 1,
		template,
		css: "",
		id: "editor",
		file,
		dev: false,
		source,
		script: scriptRange(parsed.script),
	});
}

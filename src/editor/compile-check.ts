import { splitImports } from "lusiajs/compiler/parse/imports.ts";
import { parse } from "lusiajs/compiler/parse/sections.ts";
import { compileTemplate } from "lusiajs/compiler/template/scan/scanner.ts";
import { scriptRange } from "lusiajs/compiler/template/check/script-range.ts";
import { generate } from "lusiajs/compiler/template/codegen/generate.ts";

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
		// No styles here, so there are no scope classes to add.
		scopes: { scoped: "", tree: "" },
		file,
		dev: false,
		source,
		script: scriptRange(parsed.script),
	});
}

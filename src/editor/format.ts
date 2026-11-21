import { formatLusia as formatLusiaSource } from "lusia/language/format/format.ts";
import { prettierParts, type PrettierLike } from "lusia/language/format/prettier-parts.ts";
import type { Options, Plugin } from "prettier";

let formatter: Promise<PrettierLike> | undefined;

const { formatPart, parts } = prettierParts(loadFormatter);

/** Formats a .lusia file with the shared section kernel and the browser Prettier build. */
export function formatLusia(source: string): Promise<string> {
	return formatLusiaSource(source, parts);
}

/** Formats plain TypeScript, so the playground can format an imported .ts file. */
export function formatScript(code: string): Promise<string> {
	return formatPart(code, "typescript");
}

// Prettier is large, so it loads on the first format, not when the editor opens.
function loadFormatter(): Promise<PrettierLike> {
	formatter ??= Promise.all([
		import("prettier/standalone"),
		import("prettier/plugins/estree"),
		import("prettier/plugins/html"),
		import("prettier/plugins/postcss"),
		import("prettier/plugins/typescript"),
	]).then(([standalone, estree, html, postcss, typescript]) => ({
		format: (code, options) =>
			standalone.format(code, options as Options),
		plugins: [estree, html, postcss, typescript] as Plugin[],
	}));
	return formatter;
}

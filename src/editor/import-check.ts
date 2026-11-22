import { typescriptLanguage } from "./lang/language.ts";

export const WRONG_LUSIA_IMPORT_MESSAGE = `"lusia" is not a package. Import from "lusiajs".`;

const LUSIA_SPECIFIER = /^lusia(\/|$)/;

export interface SpecifierRange {
	/** Offset of the opening quote, relative to the checked code. */
	from: number;
	/** Offset after the closing quote. */
	to: number;
}

/** The module strings of import declarations that name `lusia` or `lusia/...`, quotes included. */
export function wrongLusiaImports(code: string): SpecifierRange[] {
	const found: SpecifierRange[] = [];
	const tree = typescriptLanguage.language.parser.parse(code);
	tree.iterate({
		enter(node) {
			if (node.type.name !== "ImportDeclaration") return;
			const specifier = node.node.getChild("String");
			if (!specifier) return;
			const name = code.slice(specifier.from + 1, specifier.to - 1);
			if (LUSIA_SPECIFIER.test(name)) {
				found.push({ from: specifier.from, to: specifier.to });
			}
		},
	});
	return found;
}

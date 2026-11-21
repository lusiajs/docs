import {
	hoverAt,
	scriptHover,
	type HoverResult,
} from "lusia/editor/hover.ts";
import type { SymbolLookup } from "lusia/editor/script/imported-symbols.ts";
import { childProps, childSymbols, type EditorFile } from "./files.ts";

/** The hover for `offset`. A .ts file is all script, so it skips the markup rules. */
export function editorHover(
	text: string,
	offset: number,
	fileName: string,
	files: readonly EditorFile[],
): HoverResult | undefined {
	const symbolsOf: SymbolLookup = (specifier) =>
		childSymbols(files, fileName, specifier);
	if (fileName.endsWith(".ts")) return scriptHover(text, offset, symbolsOf);
	const propsOf = (name: string) =>
		childProps(files, fileName, text, name) ?? [];
	return hoverAt(text, offset, propsOf, symbolsOf);
}

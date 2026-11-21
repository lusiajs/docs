import { planLusiaImport } from "lusia/editor/auto-import.ts";
import {
	scriptItems,
	type ScriptItem,
} from "lusia/editor/completion-data.ts";
import {
	completionsAt,
	scriptMemberItems,
	withScriptNames,
	type CompletionResult,
} from "lusia/editor/completions.ts";
import type { SymbolLookup } from "lusia/editor/script/imported-symbols.ts";
import { childProps, childSymbols, type EditorFile } from "./files.ts";

/** Everything the editor offers at `offset`: API names, markup items, imported and local names. */
export function editorCompletions(
	text: string,
	offset: number,
	fileName: string,
	files: readonly EditorFile[],
): CompletionResult[] {
	const symbolsOf: SymbolLookup = (specifier) =>
		childSymbols(files, fileName, specifier);
	if (fileName.endsWith(".ts"))
		return typescriptCompletions(text, offset, symbolsOf);
	const propsOf = (component: string) =>
		childProps(files, fileName, text, component) ?? [];
	return completionsAt(text, offset, propsOf, symbolsOf);
}

/** A .ts file is all script: API names with their imports, and the imported and local names. */
function typescriptCompletions(
	text: string,
	offset: number,
	symbolsOf: SymbolLookup,
): CompletionResult[] {
	const members = scriptMemberItems(text, offset);
	if (members) return members;
	const base = scriptItems().map((item) => withImportEdit(item, text));
	return withScriptNames(base, text, symbolsOf);
}

function withImportEdit(item: ScriptItem, text: string): CompletionResult {
	const { importName, ...data } = item;
	const edit = importName ? planLusiaImport(text, importName) : undefined;
	return edit ? { ...data, importEdit: edit } : data;
}

import {
	snippet,
	type Completion,
	type CompletionContext,
	type CompletionSource,
	type CompletionResult as EditorCompletions,
} from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";
import type { CompletionKind } from "lusia/editor/completion-data.ts";
import type { CompletionResult } from "lusia/editor/completions.ts";
import { completionMarkdown } from "lusia/editor/markdown.ts";
import { docsElement } from "./docs-dom.ts";
import { editorCompletions } from "./editor-completions.ts";
import type { EditorFile } from "./files.ts";

const WORD = /[\w$-]*/;

const TYPES: Record<CompletionKind, string> = {
	function: "function",
	type: "type",
	class: "class",
	property: "property",
	keyword: "keyword",
	snippet: "text",
	variable: "variable",
};

/** The completion source for one file. The file list is read on each request. */
export function lusiaCompletionSource(
	fileName: string,
	getFiles: () => readonly EditorFile[],
): CompletionSource {
	return (context: CompletionContext): EditorCompletions | null => {
		const word = context.matchBefore(WORD);
		const from = word ? word.from : context.pos;
		const text = context.state.doc.toString();
		const items = editorCompletions(
			text,
			context.pos,
			fileName,
			getFiles(),
		);
		if (items.length === 0) return null;
		return { from, options: items.map(toOption) };
	};
}

function toOption(item: CompletionResult): Completion {
	return {
		label: item.label,
		type: TYPES[item.kind],
		detail: item.detail,
		info: docsInfo(item),
		apply: (view, completion, from, to) =>
			applyItem(view, completion, item, from, to),
	};
}

/** The popup docs: the item's JSDoc, or the API entry it points at, when it has one. */
function docsInfo(item: CompletionResult): (() => Node | null) | undefined {
	if (item.documentation === undefined && item.entryId === undefined)
		return undefined;
	return () => {
		const markdown = completionMarkdown(item);
		return markdown === undefined ? null : docsElement(markdown);
	};
}

/**
 * Inserts the item. An import the item needs goes in first, and the typed word moves with it.
 * Snippet placeholders use CodeMirror's ${n} syntax.
 */
function applyItem(
	view: EditorView,
	completion: Completion,
	item: CompletionResult,
	from: number,
	to: number,
): void {
	const shift = applyImport(view, item);
	const start = from + shift;
	const end = to + shift;
	if (item.snippet) {
		snippet(snippetTemplate(item.insertText))(
			view,
			completion,
			start,
			end,
		);
		return;
	}
	view.dispatch({
		changes: { from: start, to: end, insert: item.insertText },
		selection: { anchor: start + item.insertText.length },
		userEvent: "input.complete",
	});
}

/** Adds the import line. Returns how far the text after it moved. */
function applyImport(view: EditorView, item: CompletionResult): number {
	const edit = item.importEdit;
	if (!edit) return 0;
	view.dispatch({
		changes: { from: edit.start, to: edit.end, insert: edit.text },
	});
	return edit.text.length - (edit.end - edit.start);
}

/** Turns the $1 and $0 of the completion table into CodeMirror's ${1} and ${0}. */
export function snippetTemplate(template: string): string {
	return template.replace(/\$(\d+)/g, "${$1}");
}

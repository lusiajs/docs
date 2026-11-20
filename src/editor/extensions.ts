import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
	type CompletionSource,
} from "@codemirror/autocomplete";
import {
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";
import { htmlCompletionSource } from "@codemirror/lang-html";
import {
	bracketMatching,
	foldGutter,
	foldKeymap,
	indentOnInput,
} from "@codemirror/language";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import {
	highlightSelectionMatches,
	search,
	searchKeymap,
} from "@codemirror/search";
import {
	Annotation,
	Compartment,
	EditorState,
	Prec,
	type Extension,
	type Transaction,
} from "@codemirror/state";
import {
	crosshairCursor,
	drawSelection,
	dropCursor,
	EditorView,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection,
	tooltips,
	type KeyBinding,
} from "@codemirror/view";
import { lusiaCompletionSource } from "./completion-source.ts";
import type { EditorFile } from "./files.ts";
import { lusiaHover } from "./hover-source.ts";
import { lusiaHighlighting } from "./lang/highlight.ts";
import { lusiaLanguage, typescriptLanguage } from "./lang/language.ts";
import { lusiaMarks } from "./lang/marks.ts";
import { lusiaLinter } from "./lint-source.ts";
import { editorTheme } from "./theme.ts";

/** Marks a change the editor made itself (a file switch), so it is not reported as typing. */
export const externalChange = Annotation.define<boolean>();

export interface EditorStateOptions {
	fileName: string;
	getFiles: () => readonly EditorFile[];
	readOnly: Compartment;
	readOnlyValue: boolean;
	onEdit: (code: string) => void;
	format: () => void;
}

/** The extensions of one file's state. Each file keeps its own undo history and cursor. */
export function editorExtensions(options: EditorStateOptions): Extension[] {
	const { fileName, getFiles } = options;
	return [
		lineNumbers(),
		highlightActiveLineGutter(),
		highlightSpecialChars(),
		history(),
		foldGutter(),
		drawSelection(),
		dropCursor(),
		EditorState.allowMultipleSelections.of(true),
		indentOnInput(),
		lusiaHighlighting,
		bracketMatching(),
		closeBrackets(),
		autocompletion({ override: completionSources(fileName, getFiles) }),
		rectangularSelection(),
		crosshairCursor(),
		highlightActiveLine(),
		highlightSelectionMatches(),
		search({ top: true }),
		lintGutter(),
		lusiaLinter(fileName, getFiles),
		lusiaHover(fileName, getFiles),
		languageFor(fileName),
		editorTheme,
		EditorView.lineWrapping,
		// Popups sit on the page, so the demo card and the editor scroller cannot clip them.
		tooltips({ parent: document.body, position: "fixed" }),
		options.readOnly.of(readOnlyExtensions(options.readOnlyValue)),
		EditorView.contentAttributes.of({
			"aria-label": `Code of ${fileName}`,
		}),
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...searchKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap,
			...lintKeymap,
			indentWithTab,
			formatKey(options.format),
		]),
		Prec.lowest(keymap.of([{ key: "Escape", run: leaveEditor }])),
		EditorView.updateListener.of((update) => {
			if (update.docChanged && !isExternal(update.transactions))
				options.onEdit(update.state.doc.toString());
		}),
	];
}

export function readOnlyExtensions(readOnly: boolean): Extension[] {
	return [
		EditorState.readOnly.of(readOnly),
		EditorView.editable.of(!readOnly),
	];
}

function completionSources(
	fileName: string,
	getFiles: () => readonly EditorFile[],
): CompletionSource[] {
	const lusia = lusiaCompletionSource(fileName, getFiles);
	return fileName.endsWith(".ts") ? [lusia] : [lusia, htmlCompletionSource];
}

function languageFor(fileName: string): Extension {
	if (fileName.endsWith(".ts")) return typescriptLanguage.extension;
	return [lusiaLanguage.extension, lusiaMarks];
}

function formatKey(format: () => void): KeyBinding {
	return {
		key: "Shift-Alt-f",
		run: () => {
			format();
			return true;
		},
	};
}

// Tab indents, so Escape is how a keyboard user leaves the editor.
function leaveEditor(view: EditorView): boolean {
	view.contentDOM.blur();
	return true;
}

function isExternal(transactions: readonly Transaction[]): boolean {
	return transactions.some(
		(transaction) => transaction.annotation(externalChange) === true,
	);
}

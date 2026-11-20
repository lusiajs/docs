import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
	editorExtensions,
	externalChange,
	readOnlyExtensions,
} from "./extensions.ts";
import type { EditorFile } from "./files.ts";
import { formatFile } from "./format-file.ts";

export type ChangeHandler = (name: string, code: string) => void;

/**
 * One CodeMirror view for a list of files. Each file has its own state, so it keeps its
 * undo history and cursor when the user switches tabs.
 */
export class EditorSession {
	private readonly view: EditorView;
	private readonly states = new Map<string, EditorState>();
	// The code last seen for each file. A parent that ignores edits keeps the user's text.
	private readonly known = new Map<string, string>();
	private readonly readOnlyCompartment = new Compartment();
	private readonly onChange: ChangeHandler;
	private files: EditorFile[];
	private name: string;
	private readOnly: boolean;

	constructor(
		parent: HTMLElement,
		options: {
			files: EditorFile[];
			name: string;
			readOnly: boolean;
			onChange: ChangeHandler;
		},
	) {
		this.files = options.files;
		this.onChange = options.onChange;
		this.readOnly = options.readOnly;
		const file = this.pick(options.files, options.name);
		this.name = file.name;
		this.view = new EditorView({ parent, state: this.createState(file) });
	}

	/** Shows the file called `name`. A file whose code the parent changed is reloaded. */
	show(files: EditorFile[], name: string): void {
		this.files = files;
		if (files.length === 0) return;
		const file = this.pick(files, name);
		if (file.name === this.name) this.syncCode(file);
		else this.switchTo(file);
	}

	setReadOnly(readOnly: boolean): void {
		this.readOnly = readOnly;
		this.applyReadOnly();
	}

	/** Moves the cursor to a place in a file, switching to that file first. Unknown files are ignored. */
	reveal(name: string, line: number, column: number): void {
		const file = this.files.find((item) => item.name === name);
		if (!file) return;
		if (name !== this.name) this.switchTo(file);
		const doc = this.view.state.doc;
		const info = doc.line(Math.min(Math.max(line, 1), doc.lines));
		const offset = Math.min(Math.max(column - 1, 0), info.length);
		this.view.dispatch({
			selection: { anchor: info.from + offset },
			scrollIntoView: true,
		});
		this.view.dom.scrollIntoView({ block: "nearest" });
		this.view.focus();
	}

	text(): string {
		return this.view.state.doc.toString();
	}

	/** Formats the file. Resolves false when it cannot be formatted, such as on a syntax error. */
	async format(): Promise<boolean> {
		if (this.readOnly) return false;
		const name = this.name;
		const before = this.text();
		const formatted = await formatFile(name, before).catch(
			() => undefined,
		);
		if (formatted === undefined) return false;
		if (name === this.name && this.text() === before) {
			// Not an external change: the parent hears about formatting like any edit.
			this.view.dispatch({
				changes: {
					from: 0,
					to: this.view.state.doc.length,
					insert: formatted,
				},
			});
		}
		return true;
	}

	destroy(): void {
		this.view.destroy();
		this.states.clear();
	}

	private pick(files: readonly EditorFile[], name: string): EditorFile {
		return (
			files.find((file) => file.name === name) ??
			files[0] ?? { name: "", code: "" }
		);
	}

	private switchTo(file: EditorFile): void {
		this.states.set(this.name, this.view.state);
		this.name = file.name;
		const cached = this.states.get(file.name);
		const unchanged = file.code === this.known.get(file.name);
		const state = cached && unchanged ? cached : this.createState(file);
		this.view.setState(state);
		this.applyReadOnly();
	}

	private syncCode(file: EditorFile): void {
		if (file.code === this.known.get(file.name)) return;
		this.known.set(file.name, file.code);
		if (this.text() !== file.code) this.replaceCode(file.code);
	}

	private replaceCode(code: string): void {
		this.view.dispatch({
			changes: {
				from: 0,
				to: this.view.state.doc.length,
				insert: code,
			},
			annotations: externalChange.of(true),
		});
	}

	private applyReadOnly(): void {
		if (this.view.state.facet(EditorState.readOnly) === this.readOnly)
			return;
		this.view.dispatch({
			effects: this.readOnlyCompartment.reconfigure(
				readOnlyExtensions(this.readOnly),
			),
		});
	}

	private createState(file: EditorFile): EditorState {
		this.known.set(file.name, file.code);
		return EditorState.create({
			doc: file.code,
			extensions: editorExtensions({
				fileName: file.name,
				getFiles: () => this.files,
				readOnly: this.readOnlyCompartment,
				readOnlyValue: this.readOnly,
				onEdit: (code) => this.edited(file.name, code),
				format: () => void this.format(),
			}),
		});
	}

	private edited(name: string, code: string): void {
		this.known.set(name, code);
		this.onChange(name, code);
	}
}

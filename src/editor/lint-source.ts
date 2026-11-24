import { linter, type Diagnostic } from "@codemirror/lint";
import type { Extension, Text } from "@codemirror/state";
import { diagnosticsFor, type EditorDiagnostic } from "./diagnostics.ts";
import { childProps, type EditorFile } from "./files.ts";

const LINT_DELAY_MS = 300;

/** Compile errors and lint warnings for the file, shown as CodeMirror diagnostics. */
export function lusiaLinter(fileName: string, getFiles: () => readonly EditorFile[]): Extension {
  return linter(
    (view) => {
      if (!fileName.endsWith(".lusia")) return [];
      const text = view.state.doc.toString();
      const files = getFiles();
      const found = diagnosticsFor(text, fileName, (name) =>
        childProps(files, fileName, text, name),
      );
      return found.map((diagnostic) => toCodeMirror(view.state.doc, diagnostic));
    },
    { delay: LINT_DELAY_MS },
  );
}

/** The CodeMirror range of a 1-based line and column. Without a length, it runs to the line end. */
export function diagnosticRange(
  doc: Text,
  diagnostic: Pick<EditorDiagnostic, "line" | "column" | "length">,
): { from: number; to: number } {
  const line = doc.line(Math.min(Math.max(diagnostic.line, 1), doc.lines));
  const from = line.from + Math.min(Math.max(diagnostic.column - 1, 0), line.length);
  const to = diagnostic.length === undefined ? line.to : from + diagnostic.length;
  return { from, to: Math.min(Math.max(to, from), line.to) };
}

function toCodeMirror(doc: Text, diagnostic: EditorDiagnostic): Diagnostic {
  const { from, to } = diagnosticRange(doc, diagnostic);
  return {
    from,
    to,
    severity: diagnostic.severity,
    source: diagnostic.source,
    message: diagnostic.message,
    renderMessage: () => messageNode(diagnostic),
  };
}

function messageNode(diagnostic: EditorDiagnostic): HTMLElement {
  const root = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = diagnostic.code
    ? `${diagnostic.code}: ${diagnostic.message}`
    : diagnostic.message;
  root.append(title);
  if (diagnostic.hint) root.append(textLine(diagnostic.hint));
  root.append(textLine(diagnostic.where));
  return root;
}

function textLine(text: string): HTMLElement {
  const line = document.createElement("div");
  line.textContent = text;
  return line;
}

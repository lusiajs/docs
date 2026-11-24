import { getIndentUnit } from "@codemirror/language";
import { type EditorState, type Extension, RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

// Each .cm-line gets --indent-levels from its line decoration. The gradient is drawn only
// over that many indent units, so a line with no indent shows no guide.
const indentGuideTheme = EditorView.baseTheme({
  ".cm-line": {
    backgroundImage:
      "repeating-linear-gradient(to right, var(--code-guide) 0 1px, transparent 1px calc(var(--indent-unit) * 1ch))",
    backgroundOrigin: "content-box",
    backgroundRepeat: "no-repeat",
    backgroundSize: "calc(var(--indent-levels, 0) * var(--indent-unit, 2) * 1ch) 100%",
  },
});

const levelDecorations: Decoration[] = [];

export function indentGuides(): Extension {
  return [indentGuideTheme, indentGuidePlugin];
}

const indentGuidePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    private unitWidth = 0;

    constructor(view: EditorView) {
      this.syncUnit(view);
      this.decorations = buildDecorations(view, this.unitWidth);
    }

    update(update: ViewUpdate): void {
      const unitChanged = this.syncUnit(update.view);
      if (unitChanged || update.docChanged || update.viewportChanged)
        this.decorations = buildDecorations(update.view, this.unitWidth);
    }

    // Returns true when the unit width changed, so the guides must be drawn again.
    private syncUnit(view: EditorView): boolean {
      const width = getIndentUnit(view.state);
      if (width === this.unitWidth) return false;
      this.unitWidth = width;
      view.contentDOM.style.setProperty("--indent-unit", String(width));
      return true;
    }
  },
  { decorations: (plugin) => plugin.decorations },
);

function buildDecorations(view: EditorView, unitWidth: number): DecorationSet {
  const doc = view.state.doc;
  const tabSize = view.state.tabSize;
  const builder = new RangeSetBuilder<Decoration>();
  for (const range of view.visibleRanges) {
    let line = doc.lineAt(range.from);
    let level = levelAbove(view.state, line.number, unitWidth);
    while (line.from <= range.to) {
      const ownLevel = levelOfText(line.text, tabSize, unitWidth);
      if (ownLevel !== null) level = ownLevel;
      if (level > 0) builder.add(line.from, line.from, levelDecoration(level));
      if (line.number === doc.lines) break;
      line = doc.line(line.number + 1);
    }
  }
  return builder.finish();
}

// A blank line takes the level of the nearest non-blank line above it.
function levelAbove(state: EditorState, lineNumber: number, unitWidth: number): number {
  for (let number = lineNumber - 1; number >= 1; number--) {
    const text = state.doc.line(number).text;
    const level = levelOfText(text, state.tabSize, unitWidth);
    if (level !== null) return level;
  }
  return 0;
}

// Returns null for a blank line, which has no indent of its own.
function levelOfText(text: string, tabSize: number, unitWidth: number): number | null {
  if (!/\S/.test(text)) return null;
  return Math.floor(indentColumns(text, tabSize) / unitWidth);
}

function indentColumns(text: string, tabSize: number): number {
  let columns = 0;
  for (const char of text) {
    if (char === " ") columns += 1;
    else if (char === "\t") columns += tabSize - (columns % tabSize);
    else break;
  }
  return columns;
}

function levelDecoration(level: number): Decoration {
  levelDecorations[level] ??= Decoration.line({
    attributes: { style: `--indent-levels: ${level}` },
  });
  return levelDecorations[level];
}

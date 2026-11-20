import type { Range } from "@codemirror/state";
import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import { highlightTree } from "@lezer/highlight";
import { expressionEnd } from "../format-expressions.ts";
import { findSections } from "../sections.ts";
import { lusiaHighlight } from "./highlight.ts";
import { typescriptLanguage } from "./language.ts";

// Group 1 is always the name, so the start is found from the match.
const FLOW_NAME = /<\/?(IF|ELSEIF|ELSE|EACH|FOR|CONTENT|HTML)(?=[\s/>])/g;
const COMPONENT_NAME = /<\/?([A-Z][\w.]*)/g;
const LUSIA_ATTRIBUTE = /(?<=\s)(on[a-z]+|animate|bind(?:-[\w-]+)?)(?=\s*=)/g;
const FLOW_NAMES: ReadonlySet<string> = new Set([
  "IF",
  "ELSEIF",
  "ELSE",
  "EACH",
  "FOR",
  "CONTENT",
  "HTML",
]);

/** Decorations for the Lusia parts of a .lusia file that the HTML grammar does not know. */
export function lusiaMarkRanges(text: string): Range<Decoration>[] {
  const ranges: Range<Decoration>[] = [];
  for (const [from, to] of markupRanges(text)) {
    addExpressions(ranges, text, from, to);
    const markup = text.slice(from, to);
    markNames(ranges, markup, from, FLOW_NAME, () => "lusia-flow");
    markNames(ranges, markup, from, COMPONENT_NAME, (name) => componentClass(name));
    markNames(ranges, markup, from, LUSIA_ATTRIBUTE, attributeClass);
  }
  return ranges;
}

/** The text outside <script> and <style> content, as [from, to) pairs. */
function markupRanges(text: string): [number, number][] {
  const ranges: [number, number][] = [];
  let start = 0;
  for (const section of findSections(text)) {
    ranges.push([start, section.contentStart]);
    start = section.contentEnd;
  }
  ranges.push([start, text.length]);
  return ranges;
}

function addExpressions(ranges: Range<Decoration>[], text: string, from: number, to: number): void {
  let open = text.indexOf("{", from);
  while (open !== -1 && open < to) {
    const end = expressionEnd(text, open);
    if (end === -1 || end >= to) {
      open = text.indexOf("{", open + 1);
    } else {
      highlightExpression(ranges, text.slice(open, end + 1), open);
      open = text.indexOf("{", end + 1);
    }
  }
}

function highlightExpression(ranges: Range<Decoration>[], code: string, offset: number): void {
  const tree = typescriptLanguage.language.parser.parse(code);
  highlightTree(tree, lusiaHighlight, (start, end, className) => {
    ranges.push(Decoration.mark({ class: className }).range(offset + start, offset + end));
  });
}

function markNames(
  ranges: Range<Decoration>[],
  markup: string,
  from: number,
  pattern: RegExp,
  classFor: (name: string) => string | undefined,
): void {
  for (const match of markup.matchAll(pattern)) {
    const name = match[1] ?? "";
    const className = classFor(name);
    if (className === undefined) continue;
    const start = from + match.index + match[0].indexOf(name);
    ranges.push(Decoration.mark({ class: className }).range(start, start + name.length));
  }
}

function componentClass(name: string): string | undefined {
  return FLOW_NAMES.has(name) ? undefined : "lusia-component";
}

function attributeClass(name: string): string {
  if (name === "animate") return "lusia-animate";
  if (name.startsWith("bind")) return "lusia-bind";
  return "lusia-event";
}

class LusiaMarks {
  decorations: DecorationSet;

  constructor(view: { state: { doc: { toString(): string } } }) {
    this.decorations = Decoration.set(lusiaMarkRanges(view.state.doc.toString()), true);
  }

  update(update: ViewUpdate): void {
    if (update.docChanged) {
      this.decorations = Decoration.set(lusiaMarkRanges(update.state.doc.toString()), true);
    }
  }
}

export const lusiaMarks = ViewPlugin.fromClass(LusiaMarks, {
  decorations: (plugin) => plugin.decorations,
});

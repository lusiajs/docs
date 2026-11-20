import type { Parser } from "@lezer/common";
import { highlightCode } from "@lezer/highlight";
import { luciaHighlight } from "./lang/highlight.ts";
import { luciaLanguage, typescriptLanguage } from "./lang/language.ts";

const FENCE = /^```/;
const BULLET = /^- /;
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/;

const parsers: Record<string, Parser> = {
  ts: typescriptLanguage.language.parser,
  html: luciaLanguage.language.parser,
};

/**
 * Renders the small Markdown that markdown.ts writes: bold lines, code fences,
 * bullets, and `code` spans. Text is set with textContent, never as HTML.
 */
export function docsElement(markdown: string): HTMLElement {
  const root = document.createElement("div");
  root.className = "editor-docs";
  const lines = markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (FENCE.test(line)) {
      const code = takeUntil(lines, i + 1, (next) => FENCE.test(next));
      root.append(codeBlock(code.lines.join("\n"), line.slice(3).trim()));
      i = code.next;
    } else if (BULLET.test(line)) {
      const items = takeWhile(lines, i, (next) => BULLET.test(next));
      root.append(bulletList(items.lines.map((item) => item.replace(BULLET, ""))));
      i = items.next;
    } else if (line.trim() !== "") {
      root.append(paragraph(line));
    }
  }
  return root;
}

function codeBlock(code: string, language: string): HTMLElement {
  const pre = document.createElement("pre");
  const element = document.createElement("code");
  highlightInto(element, code, language);
  pre.append(element);
  return pre;
}

/** Colours the code with the editor's parser and highlight style. Unknown languages stay plain. */
function highlightInto(element: HTMLElement, code: string, language: string): void {
  const parser = parsers[language];
  if (!parser) {
    element.textContent = code;
    return;
  }
  highlightCode(
    code,
    parser.parse(code),
    luciaHighlight,
    (text, classes) => element.append(styledText(text, classes)),
    () => element.append("\n"),
  );
}

function styledText(text: string, classes: string): Node {
  if (classes === "") return document.createTextNode(text);
  const span = document.createElement("span");
  span.className = classes;
  span.textContent = text;
  return span;
}

function bulletList(items: string[]): HTMLElement {
  const list = document.createElement("ul");
  for (const item of items) {
    const element = document.createElement("li");
    element.append(...inlineNodes(item));
    list.append(element);
  }
  return list;
}

function paragraph(text: string): HTMLElement {
  const element = document.createElement("p");
  element.append(...inlineNodes(text));
  return element;
}

function inlineNodes(text: string): Node[] {
  return text.split(INLINE).flatMap((part): Node[] => {
    if (part === "") return [];
    if (part.startsWith("**") && part.endsWith("**")) return [wrap("strong", part.slice(2, -2))];
    if (part.startsWith("`") && part.endsWith("`")) return [wrap("code", part.slice(1, -1))];
    return [document.createTextNode(part)];
  });
}

function wrap(tag: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function takeUntil(
  lines: string[],
  start: number,
  stop: (line: string) => boolean,
): { lines: string[]; next: number } {
  const collected: string[] = [];
  let i = start;
  while (i < lines.length && !stop(lines[i] ?? "")) collected.push(lines[i++] ?? "");
  return { lines: collected, next: i };
}

function takeWhile(
  lines: string[],
  start: number,
  keep: (line: string) => boolean,
): { lines: string[]; next: number } {
  const collected: string[] = [];
  let i = start;
  while (i < lines.length && keep(lines[i] ?? "")) collected.push(lines[i++] ?? "");
  return { lines: collected, next: i - 1 };
}

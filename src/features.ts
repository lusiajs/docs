import { highlightInto } from "./highlight/highlight.ts";

// Snippets in the Home features are highlighted once the page is attached. Motion is handled by animate.
export function initFeatures(root: ParentNode): void {
  for (const code of root.querySelectorAll<HTMLElement>("code[data-lang]")) {
    highlightInto(code, code.textContent ?? "", code.dataset.lang ?? "none");
  }
}

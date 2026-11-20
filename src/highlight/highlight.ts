import Prism from "./languages.ts";

export function languageFor(path: string): string {
  if (path.endsWith(".lucia")) return "lucia";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".scss")) return "scss";
  return "none";
}

export function highlightInto(el: HTMLElement, code: string, language: string): void {
  const grammar = Prism.languages[language];
  if (!grammar) {
    el.textContent = code;
    return;
  }
  el.className = `language-${language}`;
  el.innerHTML = Prism.highlight(code, grammar, language);
}

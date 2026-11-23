import Prism from "./languages.ts";

export function languageFor(path: string): string {
	if (path.endsWith(".lusia")) return "lusia";
	if (path.endsWith(".ts")) return "typescript";
	if (path.endsWith(".json")) return "json";
	if (path.endsWith(".scss")) return "scss";
	return "none";
}

// The HTML for the code. Unknown languages get the code as escaped text.
export function highlightCode(code: string, language: string): string {
	const grammar = Prism.languages[language];
	if (!grammar) return escapeHtml(code);
	return Prism.highlight(code, grammar, language);
}

export function highlightInto(
	el: HTMLElement,
	code: string,
	language: string,
): void {
	el.className = `language-${language}`;
	el.innerHTML = highlightCode(code, language);
}

function escapeHtml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

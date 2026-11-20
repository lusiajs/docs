import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { sass } from "@codemirror/lang-sass";

const typescript = javascript({ typescript: true });
const scss = sass();

/** A .ts file: TypeScript. */
export const typescriptLanguage = typescript;

/**
 * A .lusia file: HTML markup, TypeScript in <script>, SCSS in <style>.
 * `lang="css"` keeps the built-in CSS parser, as the compiler does.
 */
export const lusiaLanguage = html({
	nestedLanguages: [
		{ tag: "script", parser: typescript.language.parser },
		{
			tag: "style",
			attrs: (attrs) => attrs.lang !== "css",
			parser: scss.language.parser,
		},
	],
});

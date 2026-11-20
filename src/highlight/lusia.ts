import { componentTag, expression, flowTag, htmlTag } from "./lusia-tags.ts";
import Prism from "./prism.ts";

// Prism grammars are plain nested objects, so they are read through one loose type.
const grammars = Prism.languages as Record<string, any>;

function embedded(tagName: string, language: Prism.Grammar): Prism.TokenObject {
	return {
		pattern: new RegExp(
			`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`,
			"i",
		),
		greedy: true,
		inside: {
			tag: {
				pattern: new RegExp(`<\\/?${tagName}\\b[^>]*>`, "i"),
				inside: grammars.markup.tag.inside,
			},
			rest: language,
		},
	};
}

// A .lusia file is markup with a TypeScript script and SCSS style blocks.
// Script and style come first, so their content is not read as markup. Text `{expr}` comes last.
export function registerLusia(): void {
	grammars.lusia = Prism.languages.extend("markup", {});
	Prism.languages.insertBefore("lusia", "tag", {
		script: embedded("script", grammars.typescript),
		style: embedded("style", grammars.scss),
		"flow-tag": flowTag,
		"component-tag": componentTag,
		"html-tag": htmlTag,
	});
	grammars.lusia.expression = expression;
}

import type { ApiEntry, ApiKind } from "../../reference/api.ts";

// A demo a chip can link to. Its title is only matched inside backticks.
export interface DemoRef {
	id: string;
	title: string;
	caption: string;
}

// The section or demo a keyword links to, and the one-line summary shown as its tooltip.
export interface Target {
	id: string;
	summary: string;
	kind: ApiKind | "demo";
}

// A piece of text. A chip is a code keyword. A chip with a target links to that section or demo.
export interface Part {
	text: string;
	chip: boolean;
	kind: string;
	target?: Target;
}

export interface KeywordIndex {
	// API names, matched in plain text and in backticks.
	names: Map<string, Target>;
	// Demo titles, matched only inside backticks.
	demos: Map<string, Target>;
	pattern: RegExp;
}

// Backticked text, then `{...}` expressions, then API names. Longer names come first in the alternation.
export function buildKeywordIndex(
	entries: ApiEntry[],
	demos: DemoRef[],
): KeywordIndex {
	const names = new Map<string, Target>();
	for (const entry of entries) {
		const target: Target = {
			id: entry.id,
			summary: entry.summary,
			kind: entry.kind,
		};
		names.set(entry.name, target);
		for (const member of entry.members ?? [])
			names.set(`${entry.name}.${member.name}`, target);
	}
	const demoTargets = new Map<string, Target>();
	for (const demo of demos)
		demoTargets.set(demo.title, {
			id: demo.id,
			summary: demo.caption,
			kind: "demo",
		});
	const alternatives = [...names.keys()]
		.sort((a, b) => b.length - a.length)
		.map(escapeRegex);
	const pattern = new RegExp(
		`\`[^\`]+\`|\\{[^{}]*\\}|(?<![\\w$])(?:${alternatives.join("|")})(?![\\w$])`,
		"g",
	);
	return { names, demos: demoTargets, pattern };
}

export function tokenize(
	text: string,
	index: KeywordIndex,
	selfId: string,
): Part[] {
	const parts: Part[] = [];
	let last = 0;
	for (const match of text.matchAll(index.pattern)) {
		const start = match.index;
		if (start > last) parts.push(plain(text.slice(last, start)));
		parts.push(chipFor(match[0], index, selfId));
		last = start + match[0].length;
	}
	if (last < text.length) parts.push(plain(text.slice(last)));
	return parts;
}

function chipFor(raw: string, index: KeywordIndex, selfId: string): Part {
	if (raw.startsWith("`")) return codePart(raw.slice(1, -1), index, selfId);
	if (raw.startsWith("{"))
		return { text: raw, chip: true, kind: "expression" };
	return keywordPart(raw, index.names.get(raw), selfId);
}

// Backticked text may name an API keyword or a demo. Any other backticked text is a plain chip.
function codePart(text: string, index: KeywordIndex, selfId: string): Part {
	return keywordPart(
		text,
		index.names.get(text) ?? index.demos.get(text),
		selfId,
	);
}

// A keyword links to its target, unless the target is the section it sits in.
function keywordPart(
	text: string,
	target: Target | undefined,
	selfId: string,
): Part {
	if (!target) return { text, chip: true, kind: "code" };
	const linked = target.id === selfId ? undefined : target;
	return { text, chip: true, kind: target.kind, target: linked };
}

function plain(text: string): Part {
	return { text, chip: false, kind: "text" };
}

function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

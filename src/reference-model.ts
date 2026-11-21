import type { ApiEntry, ApiKind, ApiMember } from "../../reference/api.ts";

export interface MemberRow {
	name: string;
	summary: string;
	depth: number;
}

// The Reference reads kind by kind, simplest idea first.
export const KIND_ORDER: ApiKind[] = [
	"function",
	"markup",
	"style",
	"value",
	"type",
];

export interface KindInfo {
	label: string;
	icon: string;
	color: string;
}

export const KIND_INFO: Record<ApiKind, KindInfo> = {
	function: { label: "Functions", icon: "function", color: "var(--pink)" },
	markup: { label: "Markup", icon: "code", color: "var(--sky)" },
	style: { label: "Style", icon: "palette", color: "var(--lavender)" },
	value: { label: "Values", icon: "sell", color: "var(--mint)" },
	type: { label: "Types", icon: "data_object", color: "var(--lemon)" },
};

export interface KindSection extends KindInfo {
	kind: ApiKind;
	entries: ApiEntry[];
}

// Signatures longer than this wrap their parameters, one per line.
const WRAP_AT = 60;
const OPENERS = "([{<";
const CLOSERS = ")]}>";

// The kinds the list actually has, in the Reference's fixed order, so the chips match its sections.
export function kindsOf(entries: ApiEntry[]): ApiKind[] {
	return KIND_ORDER.filter((kind) =>
		entries.some((entry) => entry.kind === kind),
	);
}

// One section per kind that has entries, each list sorted by name so the Reference reads like an index.
export function kindSections(entries: ApiEntry[]): KindSection[] {
	return KIND_ORDER.map((kind) => ({
		kind,
		...KIND_INFO[kind],
		entries: entries
			.filter((entry) => entry.kind === kind)
			.sort((a, b) => a.name.localeCompare(b.name)),
	})).filter((section) => section.entries.length > 0);
}

export interface EntryWithNeighbors {
	entry: ApiEntry;
	previous?: ApiEntry;
	next?: ApiEntry;
}

// Each entry's neighbours inside its own kind, so the detail view walks one kind at a time.
export function withNeighbors(entries: ApiEntry[]): EntryWithNeighbors[] {
	const byKind = new Map<ApiKind, ApiEntry[]>();
	for (const entry of entries) {
		const list = byKind.get(entry.kind) ?? [];
		list.push(entry);
		byKind.set(entry.kind, list);
	}
	return entries.map((entry) => {
		const list = byKind.get(entry.kind)!;
		const index = list.indexOf(entry);
		return {
			entry,
			previous: list[index - 1],
			next: list[index + 1],
		};
	});
}

// "53 entries" when all show, "1 of 53 entries" when a filter hides some.
export function countLabel(shown: number, total: number): string {
	if (shown === total)
		return `${total} ${total === 1 ? "entry" : "entries"}`;
	return `${shown} of ${total} ${total === 1 ? "entry" : "entries"}`;
}

// Nested members become rows with a depth, so the table can indent them.
export function flattenMembers(
	members: ApiMember[] = [],
	depth = 0,
): MemberRow[] {
	return members.flatMap((member) => [
		{ name: member.name, summary: member.summary, depth },
		...flattenMembers(member.members, depth + 1),
	]);
}

// The lower-case text the filter matches: the name, summary, signature, every bullet and every member name and summary.
export function searchText(entry: ApiEntry): string {
	const members = flattenMembers(entry.members).flatMap((row) => [
		row.name,
		row.summary,
	]);
	return [
		entry.name,
		entry.summary,
		entry.signature,
		...entry.bullets,
		...members,
	]
		.join(" ")
		.toLowerCase();
}

// An entry shows when its text has the query and, if any kind is picked, its kind is one of them.
export function matchesFilter(
	item: { kind: string; search: string },
	query: string,
	kinds: ReadonlySet<string>,
): boolean {
	const kindMatches = kinds.size === 0 || kinds.has(item.kind);
	return kindMatches && item.search.includes(query.trim().toLowerCase());
}

export function languageOf(entry: ApiEntry): string {
	return entry.kind === "function" ? "typescript" : "lusia";
}

// Puts each parameter on its own line when the signature is long. Short signatures stay on one line.
export function wrapSignature(signature: string): string {
	if (signature.length <= WRAP_AT) return signature;
	const list = splitParameters(signature);
	if (!list || list.params.length < 2) return signature;
	const lines = list.params.map((param) => `  ${param}`).join(",\n");
	return `${list.head}(\n${lines}\n)${list.tail}`;
}

interface ParameterList {
	head: string;
	params: string[];
	tail: string;
}

// Splits the first parameter list at its top-level commas. Arrows (=>) do not count as brackets.
function splitParameters(signature: string): ParameterList | undefined {
	const open = signature.indexOf("(");
	if (open < 0) return undefined;
	const params: string[] = [];
	let depth = 0;
	let start = open + 1;
	for (let i = open; i < signature.length; i++) {
		const char = signature[i]!;
		if (char === "=" && signature[i + 1] === ">") {
			i++;
		} else if (OPENERS.includes(char)) {
			depth++;
		} else if (CLOSERS.includes(char)) {
			depth--;
			if (depth === 0) {
				params.push(signature.slice(start, i).trim());
				return {
					head: signature.slice(0, open),
					params,
					tail: signature.slice(i + 1),
				};
			}
		} else if (char === "," && depth === 1) {
			params.push(signature.slice(start, i).trim());
			start = i + 1;
		}
	}
	return undefined;
}

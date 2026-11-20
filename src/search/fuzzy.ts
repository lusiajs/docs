// A text range [start, end) that matched the query.
export type Range = [number, number];

export interface Field {
	text: string;
	lower: string;
}

export interface Hit {
	score: number;
	ranges: Range[];
}

export interface Part {
	text: string;
	hit: boolean;
}

const SUBSEQUENCE_BASE = 20;
const SUBSEQUENCE_MAX_SPAN = 3;

export function field(text: string): Field {
	return { text, lower: text.toLowerCase() };
}

// Best match of one query token in a field. Exact and prefix matches score highest, then word starts,
// then plain substrings, then letters found in order (fuzzy).
export function matchToken(target: Field, token: string): Hit | undefined {
	const at = target.lower.indexOf(token);
	if (at >= 0) return substringHit(target.lower, token, at);
	return subsequenceHit(target.lower, token);
}

function substringHit(lower: string, token: string, at: number): Hit {
	const ranges: Range[] = [[at, at + token.length]];
	if (at === 0 && lower.length === token.length)
		return { score: 100, ranges };
	if (at === 0) return { score: 90, ranges };
	if (isWordStart(lower, at)) return { score: 70, ranges };
	return { score: 50, ranges };
}

function subsequenceHit(lower: string, token: string): Hit | undefined {
	const positions: number[] = [];
	let from = 0;
	for (const char of token) {
		const at = lower.indexOf(char, from);
		if (at < 0) return undefined;
		positions.push(at);
		from = at + 1;
	}
	const span = positions[positions.length - 1]! - positions[0]! + 1;
	if (span > token.length * SUBSEQUENCE_MAX_SPAN) return undefined;
	const score = Math.max(1, SUBSEQUENCE_BASE - (span - token.length));
	return { score, ranges: positionsToRanges(positions) };
}

function isWordStart(lower: string, at: number): boolean {
	return at === 0 || !/[a-z0-9]/.test(lower[at - 1]!);
}

function positionsToRanges(positions: number[]): Range[] {
	const ranges: Range[] = [];
	for (const at of positions) {
		const last = ranges[ranges.length - 1];
		if (last && last[1] === at) last[1] = at + 1;
		else ranges.push([at, at + 1]);
	}
	return ranges;
}

// Sorts the ranges and joins the ones that touch or overlap.
export function mergeRanges(ranges: Range[]): Range[] {
	const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
	const merged: Range[] = [];
	for (const [start, end] of sorted) {
		const last = merged[merged.length - 1];
		if (last && start <= last[1]) last[1] = Math.max(last[1], end);
		else merged.push([start, end]);
	}
	return merged;
}

// Cuts the text into parts, marking the ranges that matched. The ranges must be merged and sorted.
export function toParts(text: string, ranges: Range[]): Part[] {
	const parts: Part[] = [];
	let at = 0;
	for (const [start, end] of ranges) {
		if (start > at)
			parts.push({ text: text.slice(at, start), hit: false });
		parts.push({ text: text.slice(start, end), hit: true });
		at = end;
	}
	if (at < text.length) parts.push({ text: text.slice(at), hit: false });
	return parts;
}

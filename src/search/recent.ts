const STORAGE_KEY = "lusia-web-search-recent";
const LIMIT = 5;

// The latest term goes first, without repeats, and the list keeps only the last few.
export function withRecent(list: string[], term: string): string[] {
	return [term, ...list.filter((item) => item !== term)].slice(0, LIMIT);
}

// Storage can be blocked or hold bad data. Either way the palette just starts with no history.
export function loadRecent(): string[] {
	try {
		const parsed: unknown = JSON.parse(
			localStorage.getItem(STORAGE_KEY) ?? "[]",
		);
		return Array.isArray(parsed)
			? parsed.filter(isText).slice(0, LIMIT)
			: [];
	} catch {
		return [];
	}
}

export function saveRecent(list: string[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	} catch {
		// The history is a convenience. A full or blocked variable just means it is not kept.
	}
}

function isText(item: unknown): item is string {
	return typeof item === "string";
}

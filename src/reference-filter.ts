import { variable } from "lusiajs";
import type { ApiEntry } from "lusiajs/api";
import { countLabel, matchesFilter, searchText } from "./reference-model.ts";

// Holds the text and kind filters, and the ids of the entries they let through.
export function createReferenceFilter(entries: ApiEntry[]) {
	const text = variable("");
	const kinds = variable<string[]>([]);
	const searchById = new Map(entries.map((entry) => [entry.id, searchText(entry)]));
	const shownIds = variable.compute(
		() =>
			new Set(
				entries
					.filter((entry) =>
						matchesFilter(
							{ kind: entry.kind, search: searchById.get(entry.id)! },
							text.value,
							new Set(kinds.value),
						),
					)
					.map((entry) => entry.id),
			),
	);
	const count = variable.compute(() => countLabel(shownIds.value.size, entries.length));
	const empty = variable.compute(() => shownIds.value.size === 0);

	return {
		text,
		kinds,
		count,
		empty,
		isShown: (id: string) => shownIds.value.has(id),
		hasShown: (ids: string[]) => ids.some((id) => shownIds.value.has(id)),
		isKindPicked: (kind: string) => kinds.value.includes(kind),
		toggleKind(kind: string): void {
			kinds.value = kinds.value.includes(kind)
				? kinds.value.filter((picked) => picked !== kind)
				: [...kinds.value, kind];
		},
		clear(): void {
			text.value = "";
			kinds.value = [];
		},
	};
}

export type ReferenceFilter = ReturnType<typeof createReferenceFilter>;

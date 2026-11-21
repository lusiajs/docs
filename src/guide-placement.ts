import { api, type ApiEntry, type ApiGroup } from "lusia/api";
import { guidePlan, type GuideGroup } from "./guide-plan.ts";

// Entries that sit together under one heading. A group without sub-groups has one block with no label.
export interface PlacedBlock {
	id: string;
	label?: string;
	entries: ApiEntry[];
}

export interface PlacedGroup {
	group: ApiGroup;
	label: string;
	icon: string;
	color: string;
	blocks: PlacedBlock[];
}

export interface PlacedRow {
	entry: ApiEntry;
	group: PlacedGroup;
	block: PlacedBlock;
}

const entriesById = new Map(api.map((entry) => [entry.id, entry]));

// Type entries are reference only. The Guide leaves them out.
export function isGuideEntry(entry: ApiEntry): boolean {
	return entry.kind !== "type";
}

// The plan in order. Only entries that pass `keep` stay; empty blocks and groups are dropped.
export function placeGroups(
	keep: (entry: ApiEntry) => boolean = () => true,
): PlacedGroup[] {
	return guidePlan
		.map((group) => placeGroup(group, keep))
		.filter((group) => group.blocks.length > 0);
}

export function placedRows(groups: PlacedGroup[]): PlacedRow[] {
	return groups.flatMap((group) =>
		group.blocks.flatMap((block) =>
			block.entries.map((entry) => ({ entry, group, block })),
		),
	);
}

// The sidebar and search label of a block: "Motion / Scroll", or just "Flow" for a group with no sub-groups.
export function blockTitle(group: PlacedGroup, block: PlacedBlock): string {
	return block.label ? `${group.label} / ${block.label}` : group.label;
}

function placeGroup(
	group: GuideGroup,
	keep: (entry: ApiEntry) => boolean,
): PlacedGroup {
	const blocks: PlacedBlock[] = [];
	if (group.entries) {
		blocks.push({
			id: group.group,
			entries: resolve(group.entries, keep),
		});
	}
	for (const sub of group.subgroups ?? []) {
		blocks.push({
			id: `${group.group}-${sub.id}`,
			label: sub.label,
			entries: resolve(sub.entries, keep),
		});
	}
	return {
		group: group.group,
		label: group.label,
		icon: group.icon,
		color: group.color,
		blocks: blocks.filter((block) => block.entries.length > 0),
	};
}

// An unknown id throws at once, so a typo in the plan never reaches the page.
function resolve(
	ids: string[],
	keep: (entry: ApiEntry) => boolean,
): ApiEntry[] {
	return ids.map(entryById).filter(keep);
}

function entryById(id: string): ApiEntry {
	const entry = entriesById.get(id);
	if (!entry)
		throw new Error(`The Guide plan names an unknown api entry "${id}"`);
	return entry;
}

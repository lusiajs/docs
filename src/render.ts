import type { ApiEntry } from "lusiajs/api";
import { catalog, entryIcon, type Demo } from "./catalog.ts";
import {
	isGuideEntry,
	placeGroups,
	placedRows,
	type PlacedBlock,
	type PlacedGroup,
} from "./guide-placement.ts";
import { navLabel } from "./nav-label.ts";
import { guidePath, pageLink } from "./page-link.ts";

export interface SidebarDemo {
	id: string;
	title: string;
	href: string;
}

export interface SidebarEntry {
	id: string;
	name: string;
	icon: string;
	href: string;
	demos: SidebarDemo[];
}

export interface SidebarBlock {
	id: string;
	label?: string;
	entries: SidebarEntry[];
}

export interface SidebarGroup {
	id: string;
	label: string;
	icon: string;
	color: string;
	blocks: SidebarBlock[];
}

// The Guide's groups and blocks, without the type-only entries: they are noise for beginners.
// The sidebar and the sections both follow this order, so they always match.
export const guideGroups = placeGroups(isGuideEntry);
export const orderedEntries: ApiEntry[] = placedRows(guideGroups).map(
	(row) => row.entry,
);

export const guideSidebar: SidebarGroup[] = guideGroups.map(sidebarGroup);

function sidebarGroup(group: PlacedGroup): SidebarGroup {
	return {
		id: group.group,
		label: group.label,
		icon: group.icon,
		color: group.color,
		blocks: group.blocks.map(sidebarBlock),
	};
}

function sidebarBlock(block: PlacedBlock): SidebarBlock {
	return {
		id: block.id,
		label: block.label,
		entries: block.entries.map(guideEntry),
	};
}

function guideEntry(entry: ApiEntry): SidebarEntry {
	const demos = catalog[entry.id]?.demos ?? [];
	return {
		id: entry.id,
		name: navLabel(entry.name),
		icon: entryIcon(entry.id),
		href: pageLink(guidePath, entry.id),
		demos: demos.map(guideDemo),
	};
}

function guideDemo(demo: Demo): SidebarDemo {
	return { id: demo.id, title: demo.title, href: pageLink(guidePath, demo.id) };
}

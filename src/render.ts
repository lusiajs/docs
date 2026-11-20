import type { ApiEntry } from "../../reference/api.ts";
import { catalog, entryIcon, type Demo } from "./catalog.ts";
import {
	isGuideEntry,
	placeGroups,
	placedRows,
	type PlacedBlock,
	type PlacedGroup,
} from "./guide-placement.ts";
import { guidePath, pageLink } from "./page-link.ts";

// The Guide's groups and blocks, without the type-only entries: they are noise for beginners.
// The sidebar and the sections both follow this order, so they always match.
export const guideGroups = placeGroups(isGuideEntry);
export const orderedEntries: ApiEntry[] = placedRows(guideGroups).map(
	(row) => row.entry,
);

export function renderNav(nav: HTMLElement): void {
	for (const group of guideGroups) nav.append(navGroup(group));
}

function navGroup(group: PlacedGroup): HTMLElement {
	const wrapper = element("div", "nav-group");
	wrapper.style.setProperty("--group", group.color);
	const inner = element("div");
	for (const block of group.blocks) {
		inner.append(
			block.label ? navSubgroup(block) : navLinks(block, group.label),
		);
	}
	wrapper.append(
		navTitle(group.label, "nav-title", group.icon),
		collapsible(inner),
	);
	return wrapper;
}

// A named sub-group collapses like a group, with a smaller header.
function navSubgroup(block: PlacedBlock): HTMLElement {
	const wrapper = element("div", "nav-subgroup");
	wrapper.dataset.block = block.id;
	wrapper.append(
		navTitle(block.label!, "nav-title nav-subtitle"),
		collapsible(navLinks(block, block.label)),
	);
	return wrapper;
}

function navTitle(
	label: string,
	className: string,
	icon?: string,
): HTMLButtonElement {
	const title = element("button", className);
	title.type = "button";
	title.setAttribute("aria-expanded", "true");
	const name = element("span", "group-name");
	if (icon) name.append(glyph(icon));
	name.append(label);
	title.append(name, glyph("expand_more", "chevron"));
	return title;
}

// The animated body of a group or sub-group. Its height collapses to 0 when it is closed.
function collapsible(content: HTMLElement): HTMLElement {
	const items = element("div", "nav-items");
	const inner = element("div");
	inner.append(content);
	items.append(inner);
	return items;
}

function navLinks(block: PlacedBlock, label: string | undefined): HTMLElement {
	const links = element("nav", "nav-links");
	links.setAttribute("aria-label", label ?? "");
	for (const entry of block.entries) links.append(navEntry(entry));
	return links;
}

// An entry with two or more demos gets one nested link per demo. The sub-list opens while the entry is active.
function navEntry(entry: ApiEntry): HTMLElement {
	const wrapper = element("div", "nav-entry");
	const demos = catalog[entry.id]?.demos ?? [];
	wrapper.append(entryLink(entry));
	if (demos.length > 1) wrapper.append(subNav(demos));
	return wrapper;
}

function entryLink(entry: ApiEntry): HTMLAnchorElement {
	const link = document.createElement("a");
	link.href = pageLink(guidePath, entry.id);
	link.append(
		glyph(entryIcon(entry.id)),
		codeOrText(entry.name, "nav-label"),
	);
	return link;
}

function subNav(demos: Demo[]): HTMLElement {
	const wrapper = element("div", "nav-sub");
	const inner = element("div", "nav-sub-inner");
	for (const demo of demos) inner.append(subLink(demo));
	wrapper.append(inner);
	return wrapper;
}

function subLink(demo: Demo): HTMLAnchorElement {
	const link = document.createElement("a");
	link.href = pageLink(guidePath, demo.id);
	link.textContent = demo.title;
	return link;
}

function codeOrText(text: string, className: string): HTMLElement {
	const node = element("code", className);
	node.textContent = text;
	return node;
}

function glyph(name: string, className?: string): HTMLElement {
	const node = element("span", "material-symbols-rounded");
	if (className) node.classList.add(className);
	node.setAttribute("aria-hidden", "true");
	node.textContent = name;
	return node;
}

function element<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string,
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	if (className) node.className = className;
	return node;
}

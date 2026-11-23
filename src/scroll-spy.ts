import { EVENT, keepRunning, listen, type Stop } from "lusiajs";
import { currentLinks, setCurrentLinks } from "./sidebar-follow.ts";

// The CSS selectors of the page's section and demo targets. Each target's id matches the hash of a sidebar link.
export interface SpyTargets {
	sections: string;
	demos?: string;
}

interface Spy {
	sections: HTMLElement[];
	demos: HTMLElement[];
	visible: Set<HTMLElement>;
	linksById: Map<string, HTMLAnchorElement[]>;
}

// Runs while a page with a #sidebar is attached. The signal stops every view listener.
export function initScrollSpy(signal: AbortSignal, targets: SpyTargets): void {
	const spy: Spy = {
		sections: queryAll(targets.sections),
		demos: targets.demos ? queryAll(targets.demos) : [],
		visible: new Set(),
		linksById: groupLinksById(document.querySelector<HTMLElement>("#sidebar")!),
	};
	const stops = watchTargets(spy);
	signal.addEventListener("abort", () => {
		for (const stop of stops) stop();
	});
	activate(spy);
}

// Each target reports when it enters or leaves the screen. The sections and demos are in the page when it attaches.
function watchTargets(spy: Spy): Stop[] {
	const stops: Stop[] = [];
	keepRunning(() => {
		for (const target of [...spy.sections, ...spy.demos]) {
			stops.push(
				listen(target, EVENT.VIEW, ({ in: isIn }) => {
					setVisible(spy.visible, target, isIn);
					activate(spy);
				}),
			);
		}
	});
	return stops;
}

function setVisible(
	visible: Set<HTMLElement>,
	target: HTMLElement,
	isIn: boolean,
): void {
	if (isIn) visible.add(target);
	else visible.delete(target);
}

function queryAll(selector: string): HTMLElement[] {
	return [...document.querySelectorAll<HTMLElement>(selector)];
}

// The first visible target in page order, or the last one when the page is scrolled to its end.
function current(
	targets: HTMLElement[],
	visible: Set<HTMLElement>,
): HTMLElement | undefined {
	const shown = targets.filter((target) => visible.has(target));
	return atPageBottom() ? shown.at(-1) : shown[0];
}

function atPageBottom(): boolean {
	return (
		window.innerHeight + window.scrollY >=
		document.documentElement.scrollHeight - 2
	);
}

function groupLinksById(
	sidebar: HTMLElement,
): Map<string, HTMLAnchorElement[]> {
	const map = new Map<string, HTMLAnchorElement[]>();
	for (const link of sidebar.querySelectorAll<HTMLAnchorElement>("a")) {
		const id = link.hash.slice(1);
		map.set(id, [...(map.get(id) ?? []), link]);
	}
	return map;
}

// A demo counts only inside the current section, so the sidebar never marks a demo from another one.
function nestedDemo(
	section: HTMLElement | undefined,
	demo: HTMLElement | undefined,
): HTMLElement | undefined {
	return section && demo && section.contains(demo) ? demo : undefined;
}

function activate(spy: Spy): void {
	const section = current(spy.sections, spy.visible);
	const demo = nestedDemo(section, current(spy.demos, spy.visible));
	const links = [...linksFor(spy, section), ...linksFor(spy, demo)];
	if (sameItems(links, currentLinks())) return;
	setCurrentLinks(links);
}

function linksFor(spy: Spy, target: HTMLElement | undefined): HTMLAnchorElement[] {
	return target ? (spy.linksById.get(target.id) ?? []) : [];
}

function sameItems<T>(before: T[], after: T[]): boolean {
	return (
		before.length === after.length &&
		before.every((item, index) => item === after[index])
	);
}

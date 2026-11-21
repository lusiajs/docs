import { currentLinks, setCurrentLinks } from "./sidebar-follow.ts";

// Px from the top of the viewport where a section or demo becomes current. Below the scroll margin, so a clicked target is current.
const SPY_LINE_PX = 200;

// The CSS selectors of the page's section and demo targets. Each target's id matches the hash of a sidebar link.
export interface SpyTargets {
	sections: string;
	demos?: string;
}

let linksById = new Map<string, HTMLAnchorElement[]>();
let sections: HTMLElement[] = [];
let demos: HTMLElement[] = [];
let selectors: SpyTargets;
let observer: MutationObserver | undefined;
let frame = 0;

// Runs while a page with a #sidebar is attached. The signal removes every listener and pending frame.
export function initScrollSpy(signal: AbortSignal, targets: SpyTargets): void {
	const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
	linksById = groupLinksById(sidebar);
	selectors = targets;
	sections = queryAll(targets.sections);
	demos = targets.demos ? queryAll(targets.demos) : [];
	window.addEventListener("scroll", () => scheduleUpdate(signal), {
		passive: true,
		signal,
	});
	window.addEventListener("resize", () => scheduleUpdate(signal), {
		signal,
	});
	// Lazy components mount after the page, so their sections and demos join the targets later.
	observer = new MutationObserver(() => recollect(signal));
	observer.observe(document.getElementById("outlet") ?? document.body, {
		childList: true,
		subtree: true,
	});
	signal.addEventListener("abort", () => {
		observer?.disconnect();
		observer = undefined;
		cancelAnimationFrame(frame);
		frame = 0;
	});
	update();
}

// Call after targets are shown or hidden, so the current link follows the change without a scroll.
export function refreshScrollSpy(): void {
	update();
}

function recollect(signal: AbortSignal): void {
	const nextSections = queryAll(selectors.sections);
	const nextDemos = selectors.demos ? queryAll(selectors.demos) : [];
	if (sameItems(sections, nextSections) && sameItems(demos, nextDemos))
		return;
	sections = nextSections;
	demos = nextDemos;
	scheduleUpdate(signal);
}

function sameItems<T>(before: T[], after: T[]): boolean {
	return (
		before.length === after.length &&
		before.every((item, index) => item === after[index])
	);
}

function queryAll(selector: string): HTMLElement[] {
	return [...document.querySelectorAll<HTMLElement>(selector)];
}

function scheduleUpdate(signal: AbortSignal): void {
	if (frame || signal.aborted) return;
	frame = requestAnimationFrame(() => {
		frame = 0;
		update();
	});
}

function update(): void {
	const section = currentTarget(sections);
	const demo = currentTarget(demos);
	activate(section, demo && section?.contains(demo) ? demo : undefined);
}

// The last visible target whose top is above the line. Targets are in document order, so the scan stops early.
function currentTarget(targets: HTMLElement[]): HTMLElement | undefined {
	if (atPageBottom()) return lastVisible(targets);
	let current: HTMLElement | undefined;
	for (const target of targets) {
		if (target.hidden) continue;
		if (target.getBoundingClientRect().top > SPY_LINE_PX) break;
		current = target;
	}
	return current;
}

function lastVisible(targets: HTMLElement[]): HTMLElement | undefined {
	return targets.findLast((target) => !target.hidden);
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

// Runs on every scroll frame, so it only touches the sidebar when the current place changes.
function activate(
	section: HTMLElement | undefined,
	demo: HTMLElement | undefined,
): void {
	const links = [...linksFor(section), ...linksFor(demo)];
	if (sameItems(links, currentLinks())) return;
	setCurrentLinks(links);
}

function linksFor(target: HTMLElement | undefined): HTMLAnchorElement[] {
	return target ? (linksById.get(target.id) ?? []) : [];
}

import { attach, type Component, type Instance } from "lusia";
import { scrollToId } from "./hash-scroll.ts";
import { normalizePath } from "./page-link.ts";
import { refreshTopbar } from "./topbar.ts";

// A page: its path, its name for the topbar and the CSS route, its title, the component
// (loaded when the page is first opened), and the wiring that runs while it is attached.
export interface PageSpec {
	path: string;
	route: string;
	title: string;
	load: () => Promise<Component>;
	mount: (root: HTMLElement, signal: AbortSignal) => void;
}

interface Current {
	spec: PageSpec;
	instance: Instance;
	controller: AbortController;
}

let outlet: HTMLElement;
let pages: PageSpec[] = [];
let current: Current | undefined;
let navigation = 0;

export function startRouter(
	outletElement: HTMLElement,
	specs: PageSpec[],
): Promise<void> {
	outlet = outletElement;
	pages = specs;
	history.scrollRestoration = "manual";
	document.addEventListener("click", onClick);
	window.addEventListener(
		"popstate",
		() => void show(location.pathname, location.hash, false),
	);
	return show(location.pathname, location.hash, false);
}

function specFor(path: string): PageSpec {
	const spec =
		pages.find((page) => page.path === normalizePath(path)) ?? pages[0];
	if (!spec) throw new Error("the router needs at least one page");
	return spec;
}

// Same-origin links to a known page go through the router. A link to the page on screen only scrolls.
function onClick(event: MouseEvent): void {
	if (event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
		return;
	const link = (event.target as Element).closest<HTMLAnchorElement>(
		"a[href]",
	);
	if (!link || link.origin !== location.origin || link.target) return;
	const path = normalizePath(link.pathname);
	if (!pages.some((page) => page.path === path)) return;
	event.preventDefault();
	void show(path, link.hash, true);
}

async function show(path: string, hash: string, push: boolean): Promise<void> {
	const spec = specFor(path);
	const id = ++navigation;
	const url = spec.path + hash;
	if (push && url !== location.pathname + location.hash)
		history.pushState(null, "", url);
	if (current?.spec === spec) {
		scrollTo(hash, current.controller.signal);
		return;
	}
	// The old page stays on screen until the new page's code has loaded.
	const component = await spec.load();
	if (id !== navigation) return;
	if (current) {
		current.controller.abort();
		await current.instance.detach();
	}
	if (id !== navigation) return;
	const controller = new AbortController();
	const instance = attach(component, outlet);
	current = { spec, instance, controller };
	spec.mount(outlet, controller.signal);
	document.title = spec.title;
	document.documentElement.dataset.route = spec.route;
	markActiveLink(spec.path);
	refreshTopbar();
	scrollTo(hash, controller.signal);
}

function markActiveLink(path: string): void {
	for (const link of document.querySelectorAll<HTMLAnchorElement>(
		".main-menu a",
	)) {
		if (normalizePath(link.pathname) === path)
			link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	}
}

// Scrolls to the hash target, or to the top of the page when there is no hash.
function scrollTo(hash: string, signal: AbortSignal): void {
	scrollToId(hash ? decodeURIComponent(hash.slice(1)) : "", signal);
}

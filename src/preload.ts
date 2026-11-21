import { pageForLink } from "./page-for-link.ts";
import { preloadPage } from "./page-load.ts";
import type { PageSpec } from "./router.ts";

// Starts a page's code when the pointer or keyboard reaches its link, so the click is instant.
export function initPreload(pages: PageSpec[]): void {
	document.addEventListener("pointerenter", (event) => preloadFrom(event.target, pages), {
		capture: true,
		passive: true,
	});
	document.addEventListener("focusin", (event) => preloadFrom(event.target, pages), {
		passive: true,
	});
}

function preloadFrom(target: EventTarget | null, pages: PageSpec[]): void {
	if (!(target instanceof Element)) return;
	const link = target.closest<HTMLAnchorElement>("a[href]");
	const spec = link ? pageForLink(link, pages) : undefined;
	if (spec) preloadPage(spec);
}

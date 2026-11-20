// Px from the sidebar's top or bottom edge that counts as near the edge.
const EDGE_PX = 80;
// How long auto-scroll waits after the user scrolls or hovers the sidebar.
const PAUSE_MS = 1500;
// Scroll events within this window come from our own scrollTo, not from the user.
const OWN_SCROLL_MS = 800;

let sidebar: HTMLElement;
let pausedUntil = 0;
let ownScrollUntil = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

export function initSidebarFollow(signal: AbortSignal): void {
	sidebar = document.querySelector<HTMLElement>("#sidebar")!;
	for (const type of ["pointerenter", "wheel", "touchstart"]) {
		sidebar.addEventListener(type, pause, { passive: true, signal });
	}
	sidebar.addEventListener("scroll", onSidebarScroll, {
		passive: true,
		signal,
	});
}

// Brings a link into view inside the sidebar. The page itself does not move.
export function keepInView(link: HTMLElement): void {
	if (performance.now() < pausedUntil) return;
	const top = link.offsetTop;
	const bottom = top + link.offsetHeight;
	const viewTop = sidebar.scrollTop + EDGE_PX;
	const viewBottom = sidebar.scrollTop + sidebar.clientHeight - EDGE_PX;
	if (top >= viewTop && bottom <= viewBottom) return;
	ownScrollUntil = performance.now() + OWN_SCROLL_MS;
	sidebar.scrollTo({
		top: Math.max(0, top - sidebar.clientHeight / 3),
		behavior: reducedMotion.matches ? "auto" : "smooth",
	});
}

function pause(): void {
	pausedUntil = performance.now() + PAUSE_MS;
}

function onSidebarScroll(): void {
	if (performance.now() > ownScrollUntil) pause();
}

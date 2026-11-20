import { attach, type Instance } from "lusia";
import Loader from "./components/Loader.lusia";
import SearchPalette from "./components/SearchPalette.lusia";
import Site from "./components/Site.lusia";
import ThemeToggle from "./components/ThemeToggle.lusia";
import { pageSpecs } from "./pages.ts";
import { startRouter } from "./router.ts";
import { initSearchShortcuts } from "./search/shortcuts.ts";
import { initTopbar } from "./topbar.ts";

const LOADER_MAX_MS = 2500;

// The Loader takes over from the static copy in index.html, so the first paint never goes blank.
const loader = attach(Loader, document.body);
document.getElementById("loader")?.remove();

trackChromeHeight();
attach(Site, document.body);
attach(ThemeToggle, document.getElementById("theme-slot")!);
attach(SearchPalette, document.getElementById("search-slot")!);
initSearchShortcuts();
initTopbar();
void start(loader);

// The page attaches after the loader has left, so the hero's entrance plays where it can be seen.
async function start(loaderInstance: Instance): Promise<void> {
	await hideLoader(loaderInstance);
	await startRouter(document.getElementById("outlet")!, pageSpecs);
}

// Waits for the fonts, but never longer than LOADER_MAX_MS, so a slow font cannot hold the page.
async function hideLoader(instance: Instance): Promise<void> {
	await Promise.race([document.fonts.ready, wait(LOADER_MAX_MS)]);
	await instance.detach();
	document.documentElement.classList.remove("is-loading");
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Full screen sections subtract the real banner and topbar heights, which change on narrow screens.
function trackChromeHeight(): void {
	trackHeight(".status-strip", "--strip-h");
	trackHeight(".topbar", "--topbar-h");
}

function trackHeight(selector: string, property: string): void {
	const element = document.querySelector<HTMLElement>(selector)!;
	const update = () =>
		document.documentElement.style.setProperty(
			property,
			`${element.offsetHeight}px`,
		);
	new ResizeObserver(update).observe(element);
}

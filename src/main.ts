import { attach, type Instance } from "lusiajs";
import Loader from "./components/Loader.lusia";
import Site from "./components/Site.lusia";
import { pageSpecs } from "./pages.ts";
import { startRouter } from "./router.ts";
import { initSearchShortcuts } from "./search/shortcuts.ts";

const LOADER_MAX_MS = 2500;

// The Loader takes over from the static copy in index.html, so the first paint never goes blank.
const loader = attach(Loader, document.body);
document.getElementById("loader")?.remove();

attach(Site, document.body);
initSearchShortcuts();
void start(loader);

// The page attaches after the loader has left, so the hero's entrance plays where it can be seen.
// is-loading stays until the first page is in the outlet, so the static footer never shows above it.
async function start(loaderInstance: Instance): Promise<void> {
	await hideLoader(loaderInstance);
	try {
		await startRouter(document.getElementById("outlet")!, pageSpecs);
	} finally {
		document.documentElement.classList.remove("is-loading");
	}
}

// Waits for the fonts, but never longer than LOADER_MAX_MS, so a slow font cannot hold the page.
async function hideLoader(instance: Instance): Promise<void> {
	await Promise.race([document.fonts.ready, wait(LOADER_MAX_MS)]);
	await instance.detach();
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

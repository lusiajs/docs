import { PATH, type Component, type Props } from "lusiajs";
import PageError from "./components/PageError.lusia";
import PageLoading from "./components/PageLoading.lusia";
import { scrollToId } from "./hash-scroll.ts";
import {
  inOutlet,
  outletElement,
  setOutlet,
  currentScreen,
  detachScreen,
  attachScreen,
} from "./outlet.ts";
import { pageForLink } from "./page-for-link.ts";
import { loadPage } from "./page-load.ts";
import { normalizePath } from "./page-link.ts";
import { initPreload } from "./preload.ts";
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

type LoadResult = { component: Component } | { error: unknown };

// A page that loads within this time swaps in at once. A slower one shows the loading fallback.
const LOADING_DELAY_MS = 150;

let pages: PageSpec[] = [];
let missing: PageSpec;
let navigation = 0;

// The not-found page shows for any path that matches no page. It is not in the link list.
export function startRouter(
  outletNode: HTMLElement,
  specs: PageSpec[],
  notFound: PageSpec,
): Promise<void> {
  setOutlet(outletNode);
  pages = specs;
  missing = notFound;
  history.scrollRestoration = "manual";
  document.addEventListener("click", onClick);
  window.addEventListener("popstate", () => void show(location.pathname, location.hash, false));
  initPreload(specs);
  return show(location.pathname, location.hash, false);
}

function specFor(path: string): PageSpec {
  return pages.find((page) => page.path === normalizePath(path)) ?? missing;
}

// Same-origin links to a known page go through the router. A link to the page on screen only scrolls.
function onClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
  if (!link || link.target) return;
  const spec = pageForLink(link, pages);
  if (!spec) return;
  event.preventDefault();
  navigateTo(spec.path, link.hash);
}

export function navigateTo(path: string, hash: string): void {
  void show(path, hash, true);
}

async function show(path: string, hash: string, push: boolean): Promise<void> {
  const spec = specFor(path);
  const id = ++navigation;
  const url = addressFor(spec, path) + hash;
  // PATH.value pushes the address and keeps lusia's PATH and PARAMS in sync.
  if (push && url !== location.pathname + location.hash) PATH.value = url;
  showAddress(spec);
  const shown = currentScreen();
  if (shown?.spec === spec) {
    window.dispatchEvent(new Event("locationchange"));
    scrollTo(hash, shown.controller.signal);
    return;
  }
  const load = loadPage(spec).then(
    (component): LoadResult => ({ component }),
    (error: unknown): LoadResult => ({ error }),
  );
  const early = await Promise.race([load, pause(LOADING_DELAY_MS)]);
  if (id !== navigation) return;
  if (!early) await inOutlet(() => showLoading(id));
  const result = await load;
  await inOutlet(() => showResult(id, spec, result, hash));
}

// A missing page keeps the address that was asked for. A known page uses its own path.
function addressFor(spec: PageSpec, path: string): string {
  return spec === missing ? path : spec.path;
}

// The title, the active link and the CSS route change as soon as the reader asks for the page.
function showAddress(spec: PageSpec): void {
  document.title = spec.title;
  document.documentElement.dataset.route = spec.route;
  markActiveLink(spec.path);
}

function markActiveLink(path: string): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(".main-menu a")) {
    if (normalizePath(link.pathname) === path) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

function pause(ms: number): Promise<undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

async function showLoading(id: number): Promise<void> {
  if (id !== navigation) return;
  await detachScreen();
  if (id !== navigation) return;
  attachScreen(PageLoading);
}

async function showResult(
  id: number,
  spec: PageSpec,
  result: LoadResult,
  hash: string,
): Promise<void> {
  if (id !== navigation) return;
  await detachScreen();
  if (id !== navigation) return;
  if ("error" in result) {
    attachScreen(PageError, errorProps(spec, hash));
    return;
  }
  const screen = attachScreen(result.component, undefined, spec);
  spec.mount(outletElement(), screen.controller.signal);
  window.dispatchEvent(new Event("locationchange"));
  refreshTopbar();
  scrollTo(hash, screen.controller.signal);
}

function errorProps(spec: PageSpec, hash: string): Props {
  const retry = () => void show(spec.path, hash, false);
  return { onRetry: () => retry };
}

// Scrolls to the hash target, or to the top of the page when there is no hash.
function scrollTo(hash: string, signal: AbortSignal): void {
  scrollToId(hash ? decodeURIComponent(hash.slice(1)) : "", signal);
}

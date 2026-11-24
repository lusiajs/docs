import { expandAround } from "./nav-group.ts";

// Px from the sidebar's top or bottom edge that counts as near the edge.
const EDGE_PX = 80;
// How long auto-scroll waits after the user scrolls or hovers the sidebar.
const PAUSE_MS = 1500;
// Scroll events within this window come from our own scrollTo, not from the user.
const OWN_SCROLL_MS = 800;

let sidebar: HTMLElement;
let indicator: HTMLElement | null;
let current: HTMLAnchorElement[] = [];
let pausedUntil = 0;
let ownScrollUntil = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Runs while a page with a #sidebar is attached. The signal removes every listener.
export function initSidebarFollow(signal: AbortSignal): void {
  sidebar = document.querySelector<HTMLElement>("#sidebar")!;
  indicator = sidebar.querySelector<HTMLElement>(".nav-indicator");
  current = [];
  for (const type of ["pointerenter", "wheel", "touchstart"]) {
    sidebar.addEventListener(type, pause, { passive: true, signal });
  }
  sidebar.addEventListener("scroll", onSidebarScroll, {
    passive: true,
    signal,
  });
  sidebar.addEventListener("transitionend", () => placeIndicator(last()), {
    signal,
  });
  window.addEventListener("locationchange", markAddress, { signal });
  window.addEventListener("popstate", markAddress, { signal });
  markAddress();
}

// The links of the reader's place, in order. The last one is the most specific.
export function currentLinks(): HTMLAnchorElement[] {
  return current;
}

// Marks the reader's place in the sidebar, opens its groups and brings it into view.
export function setCurrentLinks(links: HTMLAnchorElement[]): void {
  for (const link of sidebar.querySelectorAll("a[aria-current]")) {
    link.removeAttribute("aria-current");
  }
  for (const link of links) link.setAttribute("aria-current", "page");
  current = links;
  const target = last();
  if (!target) {
    indicator?.classList.remove("is-ready");
    return;
  }
  expandAround(target);
  placeIndicator(target);
  keepInView(target);
}

// Brings a link into view inside the sidebar. The page itself does not move.
function keepInView(link: HTMLElement): void {
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

// Pages without a scroll spy (the Reference) mark the link named by the address.
function markAddress(): void {
  setCurrentLinks(addressLinks());
}

function addressLinks(): HTMLAnchorElement[] {
  if (!location.hash) return [];
  return [...sidebar.querySelectorAll<HTMLAnchorElement>("a")].filter(
    (link) => link.pathname === location.pathname && link.hash === location.hash,
  );
}

function last(): HTMLAnchorElement | undefined {
  return current.at(-1);
}

// The indicator sits on the guide line of the link's list: the group's, or the sub-list's.
function placeIndicator(link: HTMLAnchorElement | undefined): void {
  if (!indicator || !link) return;
  const guide = link.closest<HTMLElement>(".nav-links, .nav-sub")!;
  indicator.classList.add("is-ready");
  indicator.style.left = `${guide.offsetLeft - 1}px`;
  indicator.style.transform = `translateY(${link.offsetTop}px)`;
  indicator.style.height = `${link.offsetHeight}px`;
}

function pause(): void {
  pausedUntil = performance.now() + PAUSE_MS;
}

function onSidebarScroll(): void {
  if (performance.now() > ownScrollUntil) pause();
}

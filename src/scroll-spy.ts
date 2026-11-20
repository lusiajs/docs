import { expandAround } from "./nav-group.ts";
import { keepInView } from "./sidebar-follow.ts";

// Px from the top of the viewport where a section or demo becomes current. Below the scroll margin, so a clicked target is current.
const SPY_LINE_PX = 200;

// The CSS selectors of the page's section and demo targets. Each target's id matches the hash of a sidebar link.
export interface SpyTargets {
  sections: string;
  demos?: string;
}

let indicator: HTMLElement;
let linksById = new Map<string, HTMLAnchorElement[]>();
let activeLinks: HTMLAnchorElement[] = [];
let sections: HTMLElement[] = [];
let demos: HTMLElement[] = [];
let currentKey = "";
let frame = 0;

// Runs while a page with a #sidebar is attached. The signal removes every listener and pending frame.
export function initScrollSpy(signal: AbortSignal, targets: SpyTargets): void {
  indicator = document.querySelector<HTMLElement>(".nav-indicator")!;
  const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
  linksById = groupLinksById(sidebar);
  sections = queryAll(targets.sections);
  demos = targets.demos ? queryAll(targets.demos) : [];
  window.addEventListener("scroll", () => scheduleUpdate(signal), { passive: true, signal });
  window.addEventListener("resize", () => scheduleUpdate(signal), { signal });
  sidebar.addEventListener("transitionend", () => placeIndicator(activeLinks.at(-1)), { signal });
  signal.addEventListener("abort", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    currentKey = "";
    activeLinks = [];
  });
  update();
}

// Call after targets are shown or hidden, so the current link follows the change without a scroll.
export function refreshScrollSpy(): void {
  update();
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
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
}

function groupLinksById(sidebar: HTMLElement): Map<string, HTMLAnchorElement[]> {
  const map = new Map<string, HTMLAnchorElement[]>();
  for (const link of sidebar.querySelectorAll<HTMLAnchorElement>("a")) {
    const id = link.hash.slice(1);
    map.set(id, [...(map.get(id) ?? []), link]);
  }
  return map;
}

function activate(section: HTMLElement | undefined, demo: HTMLElement | undefined): void {
  const key = `${section?.id}|${demo?.id}`;
  if (key === currentKey) return;
  currentKey = key;
  const links = [...linksFor(section), ...linksFor(demo)];
  for (const link of activeLinks) link.removeAttribute("aria-current");
  for (const link of links) link.setAttribute("aria-current", "true");
  activeLinks = links;
  const current = links.at(-1);
  if (current) expandAround(current);
  placeIndicator(current);
  if (current) keepInView(current);
}

function linksFor(target: HTMLElement | undefined): HTMLAnchorElement[] {
  return target ? (linksById.get(target.id) ?? []) : [];
}

// The indicator sits on the guide line of the link's list: the group's, or the sub-list's.
function placeIndicator(link: HTMLAnchorElement | undefined): void {
  if (!link) return;
  const guide = link.closest<HTMLElement>(".nav-links, .nav-sub")!;
  indicator.classList.add("is-ready");
  indicator.style.left = `${guide.offsetLeft - 1}px`;
  indicator.style.transform = `translateY(${link.offsetTop}px)`;
  indicator.style.height = `${link.offsetHeight}px`;
}

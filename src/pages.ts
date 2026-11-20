import { renderNav } from "./render.ts";
import { initCopy } from "./copy.ts";
import { initDrawer } from "./drawer.ts";
import { initFeatures } from "./features.ts";
import { initGroupToggles } from "./nav-group.ts";
import { initReferenceFilter } from "./reference-filter.ts";
import { initScrollSpy } from "./scroll-spy.ts";
import { initSidebarFollow } from "./sidebar-follow.ts";
import type { PageSpec } from "./router.ts";
import { errorsPath, playgroundPath } from "./page-link.ts";

// The Guide's wiring starts when the page attaches and stops when the signal aborts.
function mountGuide(root: HTMLElement, signal: AbortSignal): void {
  renderNav(root.querySelector<HTMLElement>("#nav-groups")!);
  initGroupToggles(signal);
  initSidebarFollow(signal);
  initScrollSpy(signal, { sections: ".doc-section", demos: ".demo-block" });
  initDrawer(signal);
  initCopy(root, signal);
}

function mountHome(root: HTMLElement, signal: AbortSignal): void {
  initFeatures(root);
  initCopy(root, signal);
}

// The Reference shares the Guide's sidebar, drawer and scroll-spy. Its cards are the spy targets.
function mountReference(root: HTMLElement, signal: AbortSignal): void {
  initSidebarFollow(signal);
  initScrollSpy(signal, { sections: "[data-ref-entry]" });
  initDrawer(signal);
  initGroupToggles(signal);
  initReferenceFilter(root, signal);
  initCopy(root, signal);
}

// The playground's code (compiler, editor, runner) loads only when this page is opened.
function mountPlayground(root: HTMLElement, signal: AbortSignal): void {
  const stage = root.querySelector<HTMLElement>("[data-preview]");
  if (!stage) return;
  void import("./playground/run.ts").then(({ mountPlayground: start }) => start(stage, signal));
}

function mountErrors(root: HTMLElement, signal: AbortSignal): void {
  initCopy(root, signal);
}

export const pageSpecs: PageSpec[] = [
  {
    path: "/",
    route: "home",
    title: "LuciaJS",
    load: () => import("./pages/Home.lucia").then((module) => module.default),
    mount: mountHome,
  },
  {
    path: "/guide",
    route: "guide",
    title: "Guide · LuciaJS",
    load: () => import("./pages/Guide.lucia").then((module) => module.default),
    mount: mountGuide,
  },
  {
    path: "/reference",
    route: "reference",
    title: "Reference · LuciaJS",
    load: () => import("./pages/Reference.lucia").then((module) => module.default),
    mount: mountReference,
  },
  {
    path: playgroundPath,
    route: "playground",
    title: "Playground · LuciaJS",
    load: () => import("./pages/Playground.lucia").then((module) => module.default),
    mount: mountPlayground,
  },
  {
    path: errorsPath,
    route: "errors",
    title: "Errors · LuciaJS",
    load: () => import("./pages/Errors.lucia").then((module) => module.default),
    mount: mountErrors,
  },
];

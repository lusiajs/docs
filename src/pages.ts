import { initCopy } from "./copy.ts";
import { initDrawer } from "./drawer.ts";
import { initFeatures } from "./features.ts";
import { initGroupToggles } from "./nav-group.ts";
import { errorsPath, playgroundPath } from "./page-link.ts";
import { initReferenceFilter } from "./reference-filter.ts";
import { initReferenceView } from "./reference-view.ts";
import { renderNav } from "./render.ts";
import type { PageSpec } from "./router.ts";
import { initScrollSpy } from "./scroll-spy.ts";
import { initSidebarFollow } from "./sidebar-follow.ts";

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

// The Reference shares the Guide's sidebar and drawer. Its tiles filter, and its hash picks the grid or one entry.
function mountReference(root: HTMLElement, signal: AbortSignal): void {
	initSidebarFollow(signal);
	initDrawer(signal);
	initGroupToggles(signal);
	initReferenceFilter(root, signal);
	initReferenceView(root, signal);
	initCopy(root, signal);
}

// The playground's code (compiler, editor, runner) loads only when this page is opened.
function mountPlayground(root: HTMLElement, signal: AbortSignal): void {
	const stage = root.querySelector<HTMLElement>("[data-preview]");
	if (!stage) return;
	void import("./playground/run.ts").then(({ mountPlayground: start }) =>
		start(stage, signal),
	);
}

function mountErrors(root: HTMLElement, signal: AbortSignal): void {
	initCopy(root, signal);
}

export const pageSpecs: PageSpec[] = [
	{
		path: "/",
		route: "home",
		title: "Lusia",
		load: () =>
			import("./pages/Home.lusia").then((module) => module.default),
		mount: mountHome,
	},
	{
		path: "/guide",
		route: "guide",
		title: "Guide · Lusia",
		load: () =>
			import("./pages/Guide.lusia").then((module) => module.default),
		mount: mountGuide,
	},
	{
		path: "/reference",
		route: "reference",
		title: "Reference · Lusia",
		load: () =>
			import("./pages/Reference.lusia").then(
				(module) => module.default,
			),
		mount: mountReference,
	},
	{
		path: playgroundPath,
		route: "playground",
		title: "Playground · Lusia",
		load: () =>
			import("./pages/Playground.lusia").then(
				(module) => module.default,
			),
		mount: mountPlayground,
	},
	{
		path: errorsPath,
		route: "errors",
		title: "Errors · Lusia",
		load: () =>
			import("./pages/Errors.lusia").then((module) => module.default),
		mount: mountErrors,
	},
];

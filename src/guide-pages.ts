import type { ApiEntry } from "lusiajs/api";

// Guide pages that are not api entries. They sit in the Guide only, never in the Reference.
export const startProjectId = "start-project";
export const animateSpacePageId = "animate-space-page";

export const guidePages: ApiEntry[] = [
	{
		id: startProjectId,
		name: "Start a project",
		kind: "markup",
		group: "basics",
		signature: "bun create lusiajs my-app",
		summary: "Make a new Lusia app, or add Lusia to a project you already have.",
		bullets: [
			"A new app starts with one counter component.",
			"An existing project needs only the lusiajs package.",
		],
		example: "bun create lusiajs my-app",
	},
	{
		id: animateSpacePageId,
		name: "Animate space",
		kind: "markup",
		group: "motion",
		signature: "more: { animateSpace: true }",
		summary: "Slide the neighbors when an element attaches or detaches, instead of letting them jump.",
		bullets: ["Only ATTACH and DETACH use it. The default is false for both."],
		example: "animate={{ style: PRESET.FADE_IN, when: WHEN.ATTACH, more: { animateSpace: true } }}",
	},
];

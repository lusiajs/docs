import { EASE, type Style } from "lusiajs";

// How each part of the Home features stage changes when the active feature updates.
// Each plays forward when its feature becomes active. Playing back is the out move:
// a reverse skips the delay, so every part leaves together.
type Motion = Record<number, Style | [unknown, unknown, Style]>;

export const copyIn = {
	0: { opacity: 0 },
	1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 1 }],
} satisfies Motion;

// Each title letter rises on its own delay.
export const charIn = {
	0: { opacity: 0, translate: "0px 0.6em", rotate: "8deg" },
	1: [EASE.STYLE.BACK, EASE.OUT, { opacity: 1, translate: "0px 0px", rotate: "0deg" }],
} satisfies Motion;

export const codeIn = {
	0: { opacity: 0, translate: "-48px 0px" },
	1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
} satisfies Motion;

export const demoIn = {
	0: { opacity: 0, translate: "48px 0px" },
	1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
} satisfies Motion;

export const COPY_MS = 350;
export const CHAR_MS = 380;
export const CHAR_STEP_MS = 22;
export const CODE_MS = 380;
export const DEMO_MS = 380;

// The file name rolls up into view, and rolls back down as it leaves.
export const fileIn = {
	0: { opacity: 0, translate: "0px 100%" },
	1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
} satisfies Motion;

export const FILE_MS = 380;

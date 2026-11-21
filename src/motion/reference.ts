import { EASE, PRESET, WHEN } from "lusia";

// The detail card fades in and rises 16 px each time it is shown.
const cardKeys = {
	default: [EASE.STYLE.QUART, EASE.OUT],
	0: { opacity: 0, translate: "0px 16px" },
	1: { opacity: 1, translate: "0px 0px" },
};

// Rows and cards leave by fading out.
const fadeOut = {
	0: { opacity: 1 },
	1: { opacity: 0 },
};

export const cardMotion = [
	{ style: PRESET.SLIDE_UP, when: WHEN.ATTACH, duration: 300 },
	{ style: fadeOut, when: WHEN.DETACH, duration: 200 },
	{ style: cardKeys, when: WHEN.VIEW, duration: 380, more: { reverse: true } },
];

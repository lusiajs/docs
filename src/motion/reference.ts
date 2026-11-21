import { controller, EASE, PRESET, WHEN } from "lusia";

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

const gridKeys = {
	default: [EASE.STYLE.QUART, EASE.IN],
	0: { opacity: 1, translate: "0px 0px" },
	1: { opacity: 0, translate: "0px 12px" },
};

export const gridController = controller();

// The tile grid sinks and fades when a controller plays it, and rises back when reversed.
export const gridMotion = {
	style: gridKeys,
	when: WHEN.MANUAL,
	control: gridController,
	duration: 220,
};

export const cardMotion = [
	{ style: PRESET.SLIDE_UP, when: WHEN.ATTACH, duration: 300 },
	{ style: fadeOut, when: WHEN.DETACH, duration: 200 },
	{ style: cardKeys, when: WHEN.VIEW, duration: 380, more: { reverse: true } },
];

const borderKeys = {
	0: { borderColor: "var(--line)" },
	1: { borderColor: "var(--group)" },
};

export const tileHoverMotion = { style: borderKeys, when: WHEN.HOVER, duration: 220 };

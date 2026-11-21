import { EASE, WHEN } from "lusia";

// The detail card fades in and rises 16 px each time it is shown.
const cardKeys = {
	default: [EASE.STYLE.QUART, EASE.OUT],
	0: { opacity: 0, translate: "0px 16px" },
	1: { opacity: 1, translate: "0px 0px" },
};

export const cardMotion = {
	style: cardKeys,
	when: WHEN.VIEW,
	duration: 380,
	more: { reverse: true },
};

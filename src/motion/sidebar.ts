import { EASE, WHEN } from "lusia";

// The sidebar slides in from the left when its page attaches, and slides back out when it detaches.
const sidebarOutKeys = {
	default: [EASE.STYLE.QUART, EASE.IN],
	0: { opacity: 1, translate: "0px 0px" },
	1: { opacity: 0, translate: "-24px 0px" },
};

const sidebarInKeys = {
	default: [EASE.STYLE.QUART, EASE.OUT],
	0: { opacity: 0, translate: "-24px 0px" },
	1: { opacity: 1, translate: "0px 0px" },
};

export const sidebarIn = {
	style: sidebarInKeys,
	when: WHEN.ATTACH,
	duration: 400,
	keep: false,
};
export const sidebarOut = {
	style: sidebarOutKeys,
	when: WHEN.DETACH,
	duration: 250,
	more: { keepSpace: true },
};
export const sidebarMotion = [sidebarIn, sidebarOut];

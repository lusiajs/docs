import { EASE, ON } from "lusiajs";

// The sidebar slides in from the left when its page attaches, and slides back out when it detaches.
const sidebarOutKeys = {
	ease: [EASE.STYLE.QUART, EASE.IN],
	0: { opacity: 1, translate: "0px 0px" },
	1: { opacity: 0, translate: "-24px 0px" },
};

const sidebarInKeys = {
	ease: [EASE.STYLE.QUART, EASE.OUT],
	0: { opacity: 0, translate: "-24px 0px" },
	1: { opacity: 1, translate: "0px 0px" },
};

export const sidebarIn = {
	play: sidebarInKeys,
	on: ON.ATTACH,
	duration: 400,
	keep: false,
};
export const sidebarOut = {
	play: sidebarOutKeys,
	on: ON.DETACH,
	duration: 250,
};
export const sidebarMotion = [sidebarIn, sidebarOut];

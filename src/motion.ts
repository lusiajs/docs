import { EASE } from "lusia";

// Looping keyframes shared by the hero and the features section.
export const scrollHint = {
	default: [EASE.STYLE.SINE, EASE.INOUT],
	0: { translate: "0px 0px" },
	1: { translate: "0px 6px" },
};

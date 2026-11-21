import { EASE } from "lusiajs";

// The pill rises a little on hover.
export const pillLift = {
	default: [EASE.STYLE.SINE, EASE.OUT],
	0: { translate: "0px 0px" },
	1: { translate: "0px -2px" },
};

// The "Copied" label floats up and fades in, then sinks and fades out.
export const copiedLabelIn = {
	0: { opacity: 0, translate: "0px 6px" },
	1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
};
export const copiedLabelOut = {
	0: { opacity: 1, translate: "0px 0px" },
	1: [EASE.STYLE.QUART, EASE.IN, { opacity: 0, translate: "0px -6px" }],
};

// The check icon pops in when the copy succeeds.
export const checkPopIn = {
	0: { opacity: 0, scale: "0.5" },
	1: [EASE.STYLE.BACK, EASE.OUT, { opacity: 1, scale: "1" }],
};

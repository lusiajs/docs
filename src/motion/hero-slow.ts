import { EASE, EDGE, SCREEN, WHEN, type AnimateItem, type Style } from "lusiajs";
import { scrollAcross, type Follow, type ScrollPoint } from "./home-scroll.ts";

// The hero sinks with the page, so it moves at 1 - PUSH speed while the page scrolls through the zone.
const PUSH = 0.6;
const zoneEnd: ScrollPoint = [EDGE.TOP, 0];

// The zone runs from the anchor's place (80vh, or 50vh on a phone) down the page to the top of the screen.
function zoneStart(): ScrollPoint {
	return [EDGE.TOP, zoneVh() / 100];
}

function zoneVh(): number {
	return SCREEN.PHONE.value ? 50 : 80;
}

// Plays `from` to `to` over the slow-down zone only.
export function heroBetween(follow: Follow, from: Style, to: Style): AnimateItem {
	return scrollAcross(follow, from, to, zoneStart(), zoneEnd);
}

// Moves the hero down over the zone. Its wrapper gets the space below it in CSS.
// The linear easing keeps the sinking speed steady.
export function heroSlow(follow: Follow): AnimateItem | never[] {
	if (SCREEN.REDUCED_MOTION.value) return [];
	const pushVh = Math.round(zoneVh() * PUSH);
	return {
		when: WHEN.SCROLL,
		more: { follow, start: zoneStart(), end: zoneEnd },
		style: {
			default: [EASE.STYLE.LINEAR, EASE.OUT],
			0: { translate: "0 0" },
			1: { translate: `0 ${pushVh}vh` },
		},
	};
}

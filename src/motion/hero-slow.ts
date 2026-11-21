import { EASE, EDGE, WHEN, type AnimateItem, type Style } from "lusia";
import { scrollAcross, type Follow } from "./home-scroll.ts";

// The hero sinks with the page, so it moves at 1 - PUSH speed while the page scrolls through the zone.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const narrow = matchMedia("(max-width: 559px)").matches;
const ZONE_VH = narrow ? 50 : 80;
const PUSH = 0.6;
const PUSH_VH = Math.round(ZONE_VH * PUSH);

// The zone runs from the anchor's place 80vh down the page (ZONE_VH) to the top of the screen.
const zoneStart = { element: EDGE.TOP, window: ZONE_VH / 100 };
const zoneEnd = { element: EDGE.TOP, window: 0 };

// Plays `from` to `to` over the slow-down zone only.
export function heroBetween(follow: Follow, from: Style, to: Style): AnimateItem {
	return scrollAcross(follow, from, to, zoneStart, zoneEnd);
}

// Moves the hero down over the zone. Its wrapper gets the space below it in CSS.
// The linear easing keeps the sinking speed steady.
export function heroSlow(follow: Follow): AnimateItem | never[] {
	if (reducedMotion) return [];
	return {
		when: WHEN.SCROLL,
		more: { follow, start: zoneStart, end: zoneEnd },
		style: {
			default: [EASE.STYLE.LINEAR, EASE.OUT],
			0: { translate: "0 0" },
			1: { translate: `0 ${PUSH_VH}vh` },
		},
	};
}

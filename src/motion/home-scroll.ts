import {
	SCROLL_AT,
	WHEN,
	type AnimateItem,
	type ComputedVariable,
	type Style,
} from "lusia";

// Scroll motion for the Home page. All Home scroll motion lives here.
export type Follow = ComputedVariable<HTMLElement | null>;

// A SCROLL_AT mode, or `{ element, window }` with numbers from 0 to 1.
export type ScrollPoint =
	| (typeof SCROLL_AT)[keyof typeof SCROLL_AT]
	| { element: number; window: number };

// Plays `from` to `to` on the followed element's box, from `start` to `end` on the screen.
export function scrollAcross(
	follow: Follow,
	from: Style,
	to: Style,
	start: ScrollPoint,
	end: ScrollPoint,
): AnimateItem {
	return {
		when: WHEN.SCROLL,
		more: { follow, start, end },
		style: { 0: from, 1: to },
	};
}

// Each item follows a whole section (`follow`), so the progress runs while that section
// moves past the screen. `part` plays only a slice of that progress.
export function scrollBetween(
	follow: Follow,
	from: Style,
	to: Style,
	part?: [number, number],
): AnimateItem {
	const more = part ? { follow, part } : { follow };
	return { when: WHEN.SCROLL, more, style: { 0: from, 1: to } };
}

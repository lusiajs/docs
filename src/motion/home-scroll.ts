import {
	ON,
	type AnimateItem,
	type ComputedVariable,
	type Style,
} from "lusiajs";

// Scroll motion for the Home page. All Home scroll motion lives here.
export type Follow = ComputedVariable<HTMLElement | null>;

// [element edge, screen edge], each an EDGE value or a number from 0 to 1.
export type ScrollPoint = [number, number];

// Plays `from` to `to` on the followed element's box, from `start` to `end` on the screen.
export function scrollAcross(
	follow: Follow,
	from: Style,
	to: Style,
	start: ScrollPoint,
	end: ScrollPoint,
): AnimateItem {
	return {
		on: ON.SCROLL,
		options: { follow, start, end },
		play: { 0: from, 1: to },
	};
}

// Plays `from` to `to` on the element's own box, from `start` to `end` on the screen.
export function scrollOwn(
	from: Style,
	to: Style,
	start: ScrollPoint,
	end: ScrollPoint,
): AnimateItem {
	return {
		on: ON.SCROLL,
		options: { start, end },
		play: { 0: from, 1: to },
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
	const options = part ? { follow, part } : { follow };
	return { on: ON.SCROLL, options, play: { 0: from, 1: to } };
}

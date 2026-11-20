// Demo-only helpers for the SCROLL pages. They measure the same way WHEN.SCROLL does, so the readouts match the motion.

export interface Touch {
	element: number;
	window: number;
}

// The same points as SCROLL_AT.ENTER, CENTER and LEAVE.
export const AT = {
	ENTER: { element: 0, window: 1 },
	CENTER: { element: 0.5, window: 0.5 },
	LEAVE: { element: 1, window: 0 },
} satisfies Record<string, Touch>;

const MEET_PX = 4;

/** Runs `frame` once per scroll or resize, at most once per animation frame. Returns the stop function. */
export function onScrollFrame(frame: () => void): () => void {
	let pending = 0;
	const schedule = () => {
		if (pending) return;
		pending = requestAnimationFrame(() => {
			pending = 0;
			frame();
		});
	};
	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", schedule);
	frame();
	return () => {
		window.removeEventListener("scroll", schedule);
		window.removeEventListener("resize", schedule);
		cancelAnimationFrame(pending);
	};
}

/** The progress from `start` to `end`, clamped to 0 to 1. */
export function progressOf(el: Element, start: Touch, end: Touch): number {
	const rect = el.getBoundingClientRect();
	const viewport = window.innerHeight;
	const startTop = start.window * viewport - start.element * rect.height;
	const endTop = end.window * viewport - end.element * rect.height;
	const span = startTop - endTop;
	if (span === 0) return 0;
	return Math.min(1, Math.max(0, (startTop - rect.top) / span));
}

/** The progress of a tall element with `follow`: 0 when its top reaches the top, 1 when its bottom reaches the bottom. */
export function pinnedProgressOf(el: Element): number {
	const rect = el.getBoundingClientRect();
	if (rect.height <= window.innerHeight) return rect.top <= 0 ? 1 : 0;
	return Math.min(
		1,
		Math.max(0, -rect.top / (rect.height - window.innerHeight)),
	);
}

/** Writes the pinned progress of a tall element into `out` while the page scrolls. */
export function watchPinned(el: Element, out: Element): () => void {
	return onScrollFrame(() => {
		out.textContent = pinnedProgressOf(el).toFixed(2);
	});
}

/** Writes the progress with two decimals into `out` while the page scrolls. */
export function watchProgress(
	el: Element,
	start: Touch,
	end: Touch,
	out: Element,
): () => void {
	return onScrollFrame(() => {
		out.textContent = progressOf(el, start, end).toFixed(2);
	});
}

/** True when a line at `element` (a fraction of the element's height) is on a window line at `edge` (a fraction of the window). */
export function meets(rect: DOMRect, element: number, edge: number): boolean {
	const elementY = rect.top + element * rect.height;
	return Math.abs(elementY - edge * window.innerHeight) <= MEET_PX;
}

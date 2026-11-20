export type Step = 1 | -1;

// Moves the active row one step, wrapping at both ends. With no rows there is no active row.
export function moveIndex(current: number, count: number, step: Step): number {
	if (count === 0) return 0;
	return (current + step + count) % count;
}

// The first row of each group, in list order. groupCounts holds the row count of each group.
export function groupStarts(groupCounts: number[]): number[] {
	const starts: number[] = [];
	let next = 0;
	for (const count of groupCounts) {
		starts.push(next);
		next += count;
	}
	return starts;
}

// Tab jumps to the first row of the next group, Shift+Tab to the previous one, both wrapping.
export function groupJump(
	starts: number[],
	current: number,
	step: Step,
): number {
	if (starts.length === 0) return 0;
	const group = starts.findLastIndex((start) => start <= current);
	const target = (Math.max(group, 0) + step + starts.length) % starts.length;
	return starts[target]!;
}

export interface ShortcutKey {
	key: string;
	ctrlKey: boolean;
	metaKey: boolean;
}

// Ctrl+K or Cmd+K always opens the search. "/" opens it only when the user is not typing somewhere.
export function opensSearch(event: ShortcutKey, typing: boolean): boolean {
	if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")
		return true;
	return event.key === "/" && !typing;
}

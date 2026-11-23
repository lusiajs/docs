import { variable, type Variable } from "lusiajs";

// The collapse state of every group and sub-group, keyed by its data-collapse value.
const collapsed = new Map<string, Variable<boolean>>();

export function collapsedState(key: string): Variable<boolean> {
	let state = collapsed.get(key);
	if (!state) {
		state = variable(false);
		collapsed.set(key, state);
	}
	return state;
}

export function toggleGroup(key: string): void {
	const state = collapsedState(key);
	state.value = !state.value;
}

// Opens every collapsed group or sub-group around a link, so the current link is never hidden.
export function expandAround(link: HTMLElement): void {
	let holder = link.closest<HTMLElement>("[data-collapse]");
	while (holder) {
		collapsedState(holder.dataset.collapse!).value = false;
		holder =
			holder.parentElement?.closest<HTMLElement>("[data-collapse]") ?? null;
	}
}

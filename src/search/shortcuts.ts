import { opensSearch } from "./keys.ts";
import { openSearch } from "./state.ts";

// Opens the palette from anywhere on the page. Typing a "/" in a field stays a plain "/".
export function initSearchShortcuts(): void {
	window.addEventListener("keydown", (event) => {
		if (!opensSearch(event, isTyping(event.target))) return;
		event.preventDefault();
		openSearch();
	});
}

function isTyping(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.isContentEditable ||
		["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
	);
}

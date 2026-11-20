export function initDrawer(signal: AbortSignal): void {
	const menu = document.querySelector<HTMLButtonElement>("#menu")!;
	const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
	const scrim = document.querySelector<HTMLElement>("#scrim")!;

	const setOpen = (open: boolean): void => {
		sidebar.classList.toggle("is-open", open);
		scrim.hidden = !open;
		menu.setAttribute("aria-expanded", String(open));
	};

	menu.addEventListener(
		"click",
		() => setOpen(!sidebar.classList.contains("is-open")),
		{ signal },
	);
	scrim.addEventListener("click", () => setOpen(false), { signal });
	sidebar.addEventListener(
		"click",
		(event) => {
			if ((event.target as Element).closest("a")) setOpen(false);
		},
		{ signal },
	);
	document.addEventListener(
		"keydown",
		(event) => {
			if (event.key === "Escape") setOpen(false);
		},
		{ signal },
	);
}

// Shows either the tile grid or one entry's detail view, chosen by the hash.
export function entryIdFromHash(hash: string, ids: string[]): string | undefined {
	let id: string;
	try {
		id = decodeURIComponent(hash.slice(1));
	} catch {
		return undefined;
	}
	return ids.includes(id) ? id : undefined;
}

export function initReferenceView(root: HTMLElement, signal: AbortSignal): void {
	const grid = root.querySelector<HTMLElement>("[data-ref-grid]")!;
	const details = root.querySelector<HTMLElement>("[data-ref-details]")!;
	const back = root.querySelector<HTMLElement>(".ref-back")!;
	let lastHash = location.hash;
	let inDetail = false;

	function cards(): HTMLElement[] {
		return [...root.querySelectorAll<HTMLElement>("[data-ref-card]")];
	}

	function apply(): void {
		const all = cards();
		if (all.length === 0) return;
		const openId = entryIdFromHash(
			location.hash,
			all.map((card) => card.id),
		);
		const hashChanged = location.hash !== lastHash;
		lastHash = location.hash;
		if (openId) {
			if (!inDetail && hashChanged) window.scrollTo(0, 0);
			inDetail = true;
			grid.hidden = true;
			back.hidden = false;
			details.hidden = false;
			for (const card of all) card.hidden = card.id !== openId;
			return;
		}
		inDetail = false;
		grid.hidden = false;
		back.hidden = true;
		details.hidden = true;
		for (const card of all) card.hidden = true;
	}

	// The cards are lazy components: they mount after the page. Watch for that arrival.
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (holdsCard(node)) {
					apply();
					return;
				}
			}
		}
	});
	observer.observe(root, { childList: true, subtree: true });
	signal.addEventListener("abort", () => observer.disconnect());
	window.addEventListener("locationchange", apply, { signal });
	window.addEventListener("popstate", apply, { signal });
	apply();
}

// A node that is a card, or that brings cards in as its children.
function holdsCard(node: Node): boolean {
	if (!(node instanceof Element)) return false;
	return (
		node.matches("[data-ref-card]") ||
		node.querySelector("[data-ref-card]") !== null
	);
}

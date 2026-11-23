const copyIcon = "content_copy";
const resetDelay = 1500;

// The listener lives on the root, so buttons in components that mount after the page still work.
export function initCopy(root: HTMLElement, signal: AbortSignal): void {
	const onClick = (event: MouseEvent): void => {
		const button = (
			event.target as Element | null
		)?.closest<HTMLButtonElement>(".copy-button");
		if (button && root.contains(button)) void copy(button);
	};
	// Capture, because a demo swaps its code panel for the editor in its own bubble handler and the
	// click may never reach the outlet.
	root.addEventListener("click", onClick, { capture: true });
	// The outlet outlives the page, so abort takes the listener away with the page's wiring.
	signal.addEventListener(
		"abort",
		() => root.removeEventListener("click", onClick, { capture: true }),
		{ once: true },
	);
}

// Resolves to false when the browser refuses the write.
export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

async function copy(button: HTMLButtonElement): Promise<void> {
	const glyph = button.querySelector(".material-symbols-rounded")!;
	glyph.textContent = (await copyButtonText(button)) ? "check" : "error";
	setTimeout(() => (glyph.textContent = copyIcon), resetDelay);
}

// A button with data-copy-url copies the text of that file. It fails when the file cannot be loaded.
async function copyButtonText(button: HTMLButtonElement): Promise<boolean> {
	const url = button.dataset.copyUrl;
	if (url === undefined) return copyText(textToCopy(button));
	const text = await fetchText(url);
	return text !== undefined && (await copyText(text));
}

async function fetchText(url: string): Promise<string | undefined> {
	try {
		const response = await fetch(url);
		return response.ok ? await response.text() : undefined;
	} catch {
		return undefined;
	}
}

function textToCopy(button: HTMLButtonElement): string {
	if (button.dataset.copy !== undefined) return button.dataset.copy;
	return visibleCode(button.closest(".code-panel"))?.textContent ?? "";
}

// The code block that is not inside a hidden tab panel.
function visibleCode(panel: Element | null): HTMLElement | undefined {
	return [...(panel?.querySelectorAll<HTMLElement>("code") ?? [])].find(
		(code) => !code.closest("[hidden]"),
	);
}

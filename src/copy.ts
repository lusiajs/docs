const copyIcon = "content_copy";
const resetDelay = 1500;

export function initCopy(root: ParentNode, signal: AbortSignal): void {
  for (const button of root.querySelectorAll<HTMLButtonElement>(".copy-button")) {
    button.addEventListener("click", () => copy(button), { signal });
  }
}

async function copy(button: HTMLButtonElement): Promise<void> {
  const glyph = button.querySelector(".material-symbols-rounded")!;
  try {
    await navigator.clipboard.writeText(textToCopy(button));
    glyph.textContent = "check";
  } catch {
    glyph.textContent = "error";
  }
  setTimeout(() => (glyph.textContent = copyIcon), resetDelay);
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

import { navigateTo } from "./router.ts";
import { gridController } from "./motion/reference.ts";

// Opens an entry after the grid fades out, and plays the grid back in on "Back to Reference".
export function initReferenceClick(root: HTMLElement, signal: AbortSignal): void {
  root.addEventListener("click", (event) => onReferenceClick(event), { signal });
}

function onReferenceClick(event: MouseEvent): void {
  if (isModifiedClick(event)) return;
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    "a[data-ref-entry], a[data-ref-back]",
  );
  if (!link) return;
  event.preventDefault();
  if (link.matches("a[data-ref-entry]")) void playOutAndOpen(link);
  else backToGrid();
}

function isModifiedClick(event: MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

async function playOutAndOpen(link: HTMLAnchorElement): Promise<void> {
  await gridController.play();
  navigateTo("/reference", link.hash);
}

function backToGrid(): void {
  navigateTo("/reference", "");
  void gridController.reverse();
}

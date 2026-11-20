import { matchesFilter } from "./reference-model.ts";
import { refreshScrollSpy } from "./scroll-spy.ts";

function countShown(counts: Map<string, number>, key: string, shown: boolean): void {
  counts.set(key, (counts.get(key) ?? 0) + Number(shown));
}

// Filters the Reference cards and the index by text and kind.
export function initReferenceFilter(root: HTMLElement, signal: AbortSignal): void {
  const filter = root.querySelector<HTMLInputElement>("#ref-filter")!;
  const picked = new Set<string>();
  const cards = [...root.querySelectorAll<HTMLElement>("[data-ref-entry]")];
  const groups = [...root.querySelectorAll<HTMLElement>("[data-ref-group]")];
  const blocks = [...root.querySelectorAll<HTMLElement>("[data-ref-section]")];
  const indexGroups = [...root.querySelectorAll<HTMLElement>("[data-index-group]")];
  const indexBlocks = [...root.querySelectorAll<HTMLElement>("[data-index-block]")];
  const indexLinks = new Map(
    [...root.querySelectorAll<HTMLElement>("[data-ref-link]")].map((link) => [
      link.dataset.refLink!,
      link,
    ]),
  );
  const kindButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-ref-kind]")];
  const empty = root.querySelector<HTMLElement>("[data-ref-empty]")!;

  function apply(): void {
    const shownByGroup = new Map<string, number>();
    const shownByBlock = new Map<string, number>();
    let shownTotal = 0;
    for (const card of cards) {
      const shown = matchesFilter(
        { kind: card.dataset.kind!, search: card.dataset.search! },
        filter.value,
        picked,
      );
      card.hidden = !shown;
      indexLinks.get(card.id)!.hidden = !shown;
      countShown(shownByGroup, card.dataset.group!, shown);
      countShown(shownByBlock, card.dataset.block!, shown);
      shownTotal += Number(shown);
    }
    for (const group of groups) group.hidden = !shownByGroup.get(group.dataset.refGroup!);
    for (const block of blocks) block.hidden = !shownByBlock.get(block.dataset.block!);
    for (const group of indexGroups) group.hidden = !shownByGroup.get(group.dataset.indexGroup!);
    for (const block of indexBlocks) block.hidden = !shownByBlock.get(block.dataset.indexBlock!);
    empty.hidden = shownTotal > 0;
    refreshScrollSpy();
  }

  function setKind(button: HTMLButtonElement): void {
    const kind = button.dataset.refKind!;
    const on = !picked.has(kind);
    if (on) picked.add(kind);
    else picked.delete(kind);
    button.setAttribute("aria-pressed", String(on));
    apply();
  }

  function clearFilters(): void {
    filter.value = "";
    picked.clear();
    for (const button of kindButtons) button.setAttribute("aria-pressed", "false");
    apply();
  }

  filter.addEventListener("input", apply, { signal });
  for (const button of kindButtons) {
    button.addEventListener("click", () => setKind(button), { signal });
  }
  root.querySelector("[data-ref-clear]")?.addEventListener("click", clearFilters, { signal });
  apply();
}

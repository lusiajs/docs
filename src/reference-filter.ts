import { countLabel, matchesFilter } from "./reference-model.ts";
import { refreshScrollSpy } from "./scroll-spy.ts";

// Filters the Reference cards and the index by text and kind.
export function initReferenceFilter(root: HTMLElement, signal: AbortSignal): void {
  const filter = root.querySelector<HTMLInputElement>("#ref-filter")!;
  const picked = new Set<string>();
  const kindButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-ref-kind]")];
  const empty = root.querySelector<HTMLElement>("[data-ref-empty]")!;
  const count = root.querySelector<HTMLElement>("[data-ref-count]");
  let frame = 0;

  function apply(): void {
    // The cards load after the page, so re-read them on every run. Before they arrive, leave the page as it is.
    const cards = [...root.querySelectorAll<HTMLElement>("[data-ref-entry]")];
    if (cards.length === 0) return;
    const indexLinks = new Map(
      [...root.querySelectorAll<HTMLElement>("[data-ref-link]")].map((link) => [
        link.dataset.refLink!,
        link,
      ]),
    );
    const groups = [...root.querySelectorAll<HTMLElement>("[data-ref-group]")];
    const indexGroups = [...root.querySelectorAll<HTMLElement>("[data-index-group]")];
    const shownByGroup = new Map<string, boolean>();
    let shownTotal = 0;
    for (const card of cards) {
      const shown = matchesFilter(
        { kind: card.dataset.kind!, search: card.dataset.search! },
        filter.value,
        picked,
      );
      card.hidden = !shown;
      const link = indexLinks.get(card.id);
      if (link) link.hidden = !shown;
      const group = card.dataset.group!;
      shownByGroup.set(group, (shownByGroup.get(group) ?? false) || shown);
      shownTotal += Number(shown);
    }
    for (const group of groups) group.hidden = !shownByGroup.get(group.dataset.refGroup!);
    for (const group of indexGroups) group.hidden = !shownByGroup.get(group.dataset.indexGroup!);
    empty.hidden = shownTotal > 0;
    if (count) count.textContent = countLabel(shownTotal, cards.length);
    refreshScrollSpy();
  }

  function scheduleApply(): void {
    if (frame || signal.aborted) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      apply();
    });
  }

  // The cards are lazy components: they mount after the page and stay for good. Watch for that one arrival.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (holdsCard(node)) {
          scheduleApply();
          return;
        }
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  signal.addEventListener("abort", () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
  });

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

// A node that is a card, or that brings cards in as its children.
function holdsCard(node: Node): boolean {
  if (!(node instanceof Element)) return false;
  return node.matches("[data-ref-entry]") || node.querySelector("[data-ref-entry]") !== null;
}

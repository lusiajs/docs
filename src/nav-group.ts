// A group or a sub-group. Both collapse the same way.
const COLLAPSIBLE = ".nav-group, .nav-subgroup";

export function setGroupCollapsed(group: HTMLElement, collapsed: boolean): void {
  group.classList.toggle("is-collapsed", collapsed);
  group.querySelector(".nav-title")?.setAttribute("aria-expanded", String(!collapsed));
}

export function initGroupToggles(signal: AbortSignal): void {
  for (const title of document.querySelectorAll<HTMLButtonElement>(".nav-title")) {
    title.addEventListener(
      "click",
      () => {
        const group = title.closest<HTMLElement>(COLLAPSIBLE)!;
        setGroupCollapsed(group, !group.classList.contains("is-collapsed"));
      },
      { signal },
    );
  }
}

// Opens every collapsed group or sub-group around a link, so the current link is never hidden.
export function expandAround(link: HTMLElement): void {
  let collapsed = link.closest<HTMLElement>(".is-collapsed");
  while (collapsed) {
    setGroupCollapsed(collapsed, false);
    collapsed = collapsed.parentElement?.closest<HTMLElement>(".is-collapsed") ?? null;
  }
}

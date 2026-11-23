import { type ClickOutsideEvent, EVENT, listen, variable } from "lusiajs";

// Whether the docs menu drawer is open. The topbar menu button and the page sidebar read it.
export const drawerOpen = variable(false);

// The pages bind this class on the sidebar in markup.
export const sidebarClass = variable.compute(() => sidebarClassName(drawerOpen.value));

function sidebarClassName(open: boolean): string {
  return open ? "sidebar is-open" : "sidebar";
}

export function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value;
}

// Runs while a page with a sidebar is mounted. The signal stops every listener and sync.
export function initDrawer(signal: AbortSignal): void {
  const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
  const scrim = document.querySelector<HTMLElement>("#scrim")!;

  drawerOpen.value = false;
  const stops = [
    listen(sidebar, EVENT.CLICK_OUTSIDE, closeOnOutside),
    listen(sidebar, "click", closeOnLink),
    listen(scrim, "click", closeDrawer),
  ];
  signal.addEventListener("abort", () => stops.forEach((stop) => stop()), {
    once: true,
  });
}

function closeDrawer(): void {
  drawerOpen.value = false;
}

// Escape always closes. A press on the menu button is left to its own click, so it toggles once.
function closeOnOutside(event: ClickOutsideEvent): void {
  if (event.type === "keydown" || !isMenuPress(event)) closeDrawer();
}

function isMenuPress(event: ClickOutsideEvent): boolean {
  return (event.target as Element).closest("#menu") !== null;
}

function closeOnLink(event: Event): void {
  if ((event.target as Element).closest("a")) closeDrawer();
}

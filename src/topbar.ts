import { variable } from "lusiajs";

// Whether the current page is Home. Only Home has a clear topbar at the top.
export const onHome = variable(false);
// Whether the reader is still at the top of the page. The sentinel in Shell reports it.
export const atTop = variable(true);

export const topbarClass = variable.compute(() =>
  topbarClassName(onHome.value, atTop.value),
);

// On Home the bar is clear at the top of the page, and frosted once content can pass under it.
// On the Guide and Reference pages it is always solid.
function topbarClassName(home: boolean, top: boolean): string {
  if (!home) return "topbar";
  return top ? "topbar is-bare" : "topbar is-frosted";
}

// Called by the router after the route changes.
export function refreshTopbar(): void {
  onHome.value = document.documentElement.dataset.route === "home";
}

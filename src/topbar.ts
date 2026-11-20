// Scroll position up to which the bar stays clear. Below this, content can pass under the bar.
const CLEAR_PX = 8;

let topbar: HTMLElement;
let frame = 0;

export function initTopbar(): void {
  topbar = document.querySelector<HTMLElement>(".topbar")!;
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  update();
}

function scheduleUpdate(): void {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    update();
  });
}

// On Home the bar is clear at the top of the page, and frosted once content can pass under it.
// On the Guide and Reference pages it is always solid.
function update(): void {
  const onHome = document.documentElement.dataset.route === "home";
  const clear = onHome && window.scrollY <= CLEAR_PX;
  topbar.classList.toggle("is-bare", clear);
  topbar.classList.toggle("is-frosted", onHome && !clear);
}

// Called by the router after the route changes.
export function refreshTopbar(): void {
  update();
}

const PULL = 0.25;

function isMouse(event: PointerEvent): boolean {
  return event.pointerType === "mouse" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Moves the element toward the pointer. Only mouse pointers pull, touch does not.
export function pull(event: PointerEvent): void {
  if (!isMouse(event)) return;
  const target = event.currentTarget as HTMLElement;
  const box = target.getBoundingClientRect();
  const x = (event.clientX - box.left - box.width / 2) * PULL;
  const y = (event.clientY - box.top - box.height / 2) * PULL;
  target.style.translate = `${x}px ${y}px`;
}

export function release(event: PointerEvent): void {
  (event.currentTarget as HTMLElement).style.translate = "";
}

// Sets the glow position on a card, in px from its top left corner.
export function glow(event: PointerEvent): void {
  const card = event.currentTarget as HTMLElement;
  const box = card.getBoundingClientRect();
  card.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
  card.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
}

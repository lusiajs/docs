// How long the hash target is held in place while the page settles.
const HOLD_MS = 3000;
// Any of these means the reader is scrolling, so the page stops moving the target.
const READER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

let release: (() => void) | undefined;

// Jumps to the target and keeps it at the top while lazy demos load and the page grows.
export function scrollToTarget(target: HTMLElement | null): void {
  release?.();
  if (!target) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  alignTop(target);
  release = hold(target);
}

function alignTop(target: HTMLElement): void {
  target.scrollIntoView({ block: "start", behavior: "instant" });
}

function hold(target: HTMLElement): () => void {
  const controller = new AbortController();
  const observer = new ResizeObserver(() => alignTop(target));
  observer.observe(document.body);
  const timer = setTimeout(stop, HOLD_MS);
  for (const type of READER_EVENTS) {
    window.addEventListener(type, stop, { once: true, passive: true, signal: controller.signal });
  }

  function stop(): void {
    observer.disconnect();
    clearTimeout(timer);
    controller.abort();
    release = undefined;
  }
  return stop;
}

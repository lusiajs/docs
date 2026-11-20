// How long the hash target is held in place while the page settles.
const HOLD_MS = 3000;
// How long to wait for a hash target that a lazy component has not mounted yet.
const HASH_WAIT_MS = 10_000;
// Any of these means the reader is scrolling, so the page stops moving the target.
const READER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

let release: (() => void) | undefined;

// Jumps to the target, or waits for a lazy component to mount it.
export function scrollToId(id: string | undefined, signal: AbortSignal): void {
  if (!id) {
    scrollToTarget(null);
    return;
  }
  const target = document.getElementById(id);
  if (target) {
    scrollToTarget(target);
    return;
  }
  const root = document.getElementById("outlet") ?? document.body;
  const observer = new MutationObserver(() => {
    const found = document.getElementById(id);
    if (!found) return;
    stop();
    scrollToTarget(found);
  });
  const timer = setTimeout(stop, HASH_WAIT_MS);
  signal.addEventListener("abort", stop, { once: true });
  observer.observe(root, { childList: true, subtree: true });

  function stop(): void {
    observer.disconnect();
    clearTimeout(timer);
  }
}

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

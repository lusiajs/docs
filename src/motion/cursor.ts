import type { Variable } from "lusia";
import { spawnSparks, type Spark } from "./sparks.ts";

const TRAIL_GAP_MS = 45;
const trailTones = ["var(--pink)", "var(--lavender)", "var(--lemon)", "var(--mint)", "var(--sky)"];

// A sparkle trail that follows mouse pointers.
export function trackCursor(sparks: Variable<Spark[]>): () => void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let lastTrail = 0;

  function onMove(event: PointerEvent): void {
    if (event.timeStamp - lastTrail < TRAIL_GAP_MS) return;
    lastTrail = event.timeStamp;
    spawnSparks(sparks, {
      kind: "star",
      tones: trailTones,
      count: 1,
      x: event.clientX,
      y: event.clientY,
      spread: 14,
      lift: -6,
      duration: 700,
    });
  }

  if (fine) window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
  };
}

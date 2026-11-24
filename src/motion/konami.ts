const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// Calls onMatch when the Konami code is typed. Returns the cleanup.
export function watchKonami(onMatch: () => void): () => void {
  let progress = 0;

  function onKey(event: KeyboardEvent): void {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    progress = key === sequence[progress] ? progress + 1 : Number(key === sequence[0]);
    if (progress === sequence.length) {
      progress = 0;
      onMatch();
    }
  }

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}

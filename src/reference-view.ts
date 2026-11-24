import { listen, variable, type ComputedVariable, type Variable } from "lusiajs";

// The entry id a hash opens, or undefined when the hash names none and the grid shows.
export function entryIdFromHash(hash: string, ids: string[]): string | undefined {
  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return undefined;
  }
  return ids.includes(id) ? id : undefined;
}

// Keeps the hash variable in step with the address bar and the back button.
export function watchHash(hash: Variable<string>): void {
  const update = (): void => {
    hash.value = location.hash;
  };
  listen(window, "locationchange", update);
  listen(window, "popstate", update);
}

// Scrolls to the top when an entry opens from the grid. Moving from one entry to another keeps the scroll.
export function scrollOnOpen(openId: ComputedVariable<string | undefined>): void {
  let wasOpen = openId.peek() !== undefined;
  variable.autoRun(() => {
    const isOpen = openId.value !== undefined;
    if (isOpen && !wasOpen) window.scrollTo(0, 0);
    wasOpen = isOpen;
  });
}

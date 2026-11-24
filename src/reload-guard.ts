// Automatic reloads are at least a minute apart, so a chunk that stays missing cannot loop the page.
const RELOAD_WINDOW_MS = 60_000;
const STORAGE_KEY = "lusia-docs:auto-reload-at";

export type ReloadStorage = Pick<Storage, "getItem" | "setItem">;

// True when no automatic reload happened in the window, and records this one.
// If storage fails, no reload is allowed: the reload could not be recorded.
export function claimAutoReload(getStorage: () => ReloadStorage, now: number): boolean {
  try {
    const storage = getStorage();
    const last = storage.getItem(STORAGE_KEY);
    if (last !== null && now - Number(last) < RELOAD_WINDOW_MS) return false;
    storage.setItem(STORAGE_KEY, String(now));
    return true;
  } catch {
    return false;
  }
}

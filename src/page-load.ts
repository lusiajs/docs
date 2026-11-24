import type { Component } from "lusiajs";
import type { PageSpec } from "./router.ts";
import { claimAutoReload, type ReloadStorage } from "./reload-guard.ts";
import { isStaleChunkError } from "./stale-chunk.ts";

export interface PageLoadDeps {
  reload: () => void;
  getStorage: () => ReloadStorage;
  now: () => number;
}

// A reload ends the page, so the load stays pending until the browser leaves.
function reloading(): Promise<Component> {
  return new Promise(() => {});
}

// Only a real navigation may reload or show the error. A stale chunk reloads once a minute at most.
function recover(error: unknown, deps: PageLoadDeps): Promise<Component> {
  console.error(error);
  if (isStaleChunkError(error) && claimAutoReload(deps.getStorage, deps.now())) {
    deps.reload();
    return reloading();
  }
  throw error;
}

// Each page's code is fetched once and kept. A failed fetch is forgotten, so the next try runs it again.
export function createPageLoader(deps: PageLoadDeps): {
  loadPage: (spec: PageSpec) => Promise<Component>;
  preloadPage: (spec: PageSpec) => void;
} {
  const fetches = new Map<PageSpec, Promise<Component>>();

  function fetchPage(spec: PageSpec): Promise<Component> {
    const known = fetches.get(spec);
    if (known) return known;
    const pending = spec.load();
    fetches.set(spec, pending);
    pending.catch(() => {
      if (fetches.get(spec) === pending) fetches.delete(spec);
    });
    return pending;
  }

  return {
    loadPage: (spec) => fetchPage(spec).catch((error: unknown) => recover(error, deps)),
    // A failed preload is silent and leaves no trace, so the real click starts a fresh load.
    preloadPage: (spec) => {
      fetchPage(spec).catch(() => {});
    },
  };
}

export const { loadPage, preloadPage } = createPageLoader({
  reload: () => location.reload(),
  getStorage: () => sessionStorage,
  now: () => Date.now(),
});

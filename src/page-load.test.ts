import { describe, expect, test } from "bun:test";
import type { Component } from "lusiajs";
import { createPageLoader, type PageLoadDeps } from "./page-load.ts";
import type { PageSpec } from "./router.ts";

const fakePage = {} as Component;

function specWith(load: () => Promise<Component>): PageSpec {
  return { path: "/x", route: "x", title: "X", load, mount: () => {} };
}

// The message Chrome gives when a lazy chunk is missing after a deploy.
function staleError(): TypeError {
  return new TypeError("Failed to fetch dynamically imported module: /chunk.js");
}

function fakeDeps() {
  const items = new Map<string, string>();
  const state = { reloads: 0, now: 1_000_000 };
  const deps: PageLoadDeps = {
    reload: () => {
      state.reloads++;
    },
    getStorage: () => ({
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => {
        items.set(key, value);
      },
    }),
    now: () => state.now,
  };
  return { deps, state, items };
}

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("page loader", () => {
  test("a stale chunk failure reloads the page once", async () => {
    const { deps, state } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    void loadPage(specWith(() => Promise.reject(staleError())));
    await tick();
    expect(state.reloads).toBe(1);
  });

  test("a second stale failure within 60 seconds shows the error instead", async () => {
    const { deps, state } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    void loadPage(specWith(() => Promise.reject(staleError())));
    await tick();
    state.now += 10_000;
    await expect(loadPage(specWith(() => Promise.reject(staleError())))).rejects.toThrow(
      "Failed to fetch",
    );
    expect(state.reloads).toBe(1);
  });

  test("a stale failure after 60 seconds reloads again", async () => {
    const { deps, state } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    void loadPage(specWith(() => Promise.reject(staleError())));
    await tick();
    state.now += 61_000;
    void loadPage(specWith(() => Promise.reject(staleError())));
    await tick();
    expect(state.reloads).toBe(2);
  });

  test("another kind of failure is not reloaded", async () => {
    const { deps, state } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    await expect(loadPage(specWith(() => Promise.reject(new Error("offline"))))).rejects.toThrow(
      "offline",
    );
    expect(state.reloads).toBe(0);
  });

  test("a failed load is forgotten, so the next try runs it again", async () => {
    const { deps } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    let attempts = 0;
    const spec = specWith(() => {
      attempts++;
      return attempts === 1 ? Promise.reject(new Error("offline")) : Promise.resolve(fakePage);
    });
    await expect(loadPage(spec)).rejects.toThrow("offline");
    await expect(loadPage(spec)).resolves.toBe(fakePage);
    expect(attempts).toBe(2);
  });

  test("a page loads once while in flight and after it is loaded", async () => {
    const { deps } = fakeDeps();
    const { loadPage } = createPageLoader(deps);
    let calls = 0;
    const spec = specWith(() => {
      calls++;
      return Promise.resolve(fakePage);
    });
    await Promise.all([loadPage(spec), loadPage(spec)]);
    await loadPage(spec);
    expect(calls).toBe(1);
  });

  test("storage that throws on read does not crash and does not reload", async () => {
    let reloads = 0;
    const { loadPage } = createPageLoader({
      reload: () => {
        reloads++;
      },
      getStorage: () => {
        throw new Error("storage denied");
      },
      now: () => 1_000_000,
    });
    await expect(loadPage(specWith(() => Promise.reject(staleError())))).rejects.toThrow(
      "Failed to fetch",
    );
    expect(reloads).toBe(0);
  });

  test("storage that throws on write does not crash and does not reload", async () => {
    let reloads = 0;
    const { loadPage } = createPageLoader({
      reload: () => {
        reloads++;
      },
      getStorage: () => ({
        getItem: () => null,
        setItem: () => {
          throw new Error("quota exceeded");
        },
      }),
      now: () => 1_000_000,
    });
    await expect(loadPage(specWith(() => Promise.reject(staleError())))).rejects.toThrow(
      "Failed to fetch",
    );
    expect(reloads).toBe(0);
  });
});

describe("page preload", () => {
  test("a stale chunk failure during preload does not reload or write the guard", async () => {
    const { deps, state, items } = fakeDeps();
    const { preloadPage } = createPageLoader(deps);
    preloadPage(specWith(() => Promise.reject(staleError())));
    await tick();
    expect(state.reloads).toBe(0);
    expect(items.size).toBe(0);
  });

  test("after a failed preload, a real navigation reloads once", async () => {
    const { deps, state, items } = fakeDeps();
    const { loadPage, preloadPage } = createPageLoader(deps);
    const spec = specWith(() => Promise.reject(staleError()));
    preloadPage(spec);
    await tick();
    expect(state.reloads).toBe(0);
    void loadPage(spec);
    await tick();
    expect(state.reloads).toBe(1);
    expect(items.size).toBe(1);
  });

  test("a navigation that joins a failing preload still reloads", async () => {
    const { deps, state } = fakeDeps();
    const { loadPage, preloadPage } = createPageLoader(deps);
    let fail: (error: unknown) => void = () => {};
    const spec = specWith(
      () =>
        new Promise<Component>((_, reject) => {
          fail = reject;
        }),
    );
    preloadPage(spec);
    void loadPage(spec);
    fail(staleError());
    await tick();
    expect(state.reloads).toBe(1);
  });

  test("a successful preload makes the later navigation reuse the component", async () => {
    const { deps } = fakeDeps();
    const { loadPage, preloadPage } = createPageLoader(deps);
    let calls = 0;
    const spec = specWith(() => {
      calls++;
      return Promise.resolve(fakePage);
    });
    preloadPage(spec);
    await expect(loadPage(spec)).resolves.toBe(fakePage);
    expect(calls).toBe(1);
  });
});

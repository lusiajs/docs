import { describe, expect, test } from "bun:test";
import { renderNav } from "./render.ts";

describe("renderNav", () => {
  test("every sidebar link names the Guide page before its hash", () => {
    const nav = document.createElement("nav");
    renderNav(nav);
    const hrefs = [...nav.querySelectorAll("a")].map((link) => link.getAttribute("href"));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toMatch(/^\/guide#[\w-]+$/);
  });
});

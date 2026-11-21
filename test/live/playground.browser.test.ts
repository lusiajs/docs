import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { chromium, type Browser, type Page } from "playwright";
import {
  BUILD_TIMEOUT_MS,
  TEST_TIMEOUT_MS,
  openSitePage,
  serveSite,
  type SiteServer,
} from "./serve.ts";

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };
// A new frame stays pending until it has mounted. The shown one is the one that is not pending.
const SHOWN_FRAME = "iframe.preview-frame:not(.is-pending)";

const launch = await chromium
  .launch({ executablePath: process.env.LUSIA_CHROMIUM || undefined })
  .then((browser) => ({ browser, reason: "" }))
  .catch((error: Error) => ({ browser: null, reason: error.message.split("\n")[0] }));
const browser: Browser | null = launch.browser;
const suite = browser ? describe : describe.skip;

let site: SiteServer | undefined;

beforeAll(async () => {
  if (browser) site = await serveSite(["/playground", "/guide"]);
}, BUILD_TIMEOUT_MS);

afterAll(async () => {
  await browser?.close();
  site?.close();
});

async function openPlayground(viewport: { width: number; height: number }): Promise<Page> {
  const page = await openSitePage(browser!);
  await page.setViewportSize(viewport);
  await page.goto(`${site!.base}/playground`);
  await page.waitForFunction(() => document.documentElement.dataset.route === "playground");
  await page.locator(".cm-editor").waitFor({ state: "visible", timeout: 15_000 });
  await waitForEnterAnimation(page);
  return page;
}

// The page enters with a translate, which extends the scrollable overflow until it ends.
async function waitForEnterAnimation(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const main = document.querySelector<HTMLElement>("main.playground");
    if (!main) return false;
    const translate = getComputedStyle(main).translate;
    return translate === "none" || translate === "0px 0px";
  });
}

interface Layout {
  scrollHeight: number;
  innerHeight: number;
  mainHeight: number;
  stripHeight: number;
  topbarHeight: number;
}

function readLayout(page: Page): Promise<Layout> {
  return page.evaluate(() => {
    const main = document.querySelector<HTMLElement>("main.playground");
    const strip = document.querySelector<HTMLElement>(".status-strip");
    const topbar = document.querySelector<HTMLElement>(".topbar");
    return {
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      mainHeight: main?.getBoundingClientRect().height ?? -1,
      stripHeight: strip?.getBoundingClientRect().height ?? -1,
      topbarHeight: topbar?.getBoundingClientRect().height ?? -1,
    };
  });
}

function expectNoScroll(layout: Layout): void {
  expect(layout.scrollHeight).toBeLessThanOrEqual(layout.innerHeight + 1);
  const available = layout.innerHeight - layout.stripHeight - layout.topbarHeight;
  expect(Math.abs(layout.mainHeight - available)).toBeLessThanOrEqual(1);
}

suite("Playground page", () => {
  test(
    "owns the viewport on a desktop screen",
    async () => {
      const page = await openPlayground(DESKTOP);
      expect(await page.locator(".status-strip").isVisible()).toBe(true);
      expect(await page.locator(".site-footer").isVisible()).toBe(false);
      expectNoScroll(await readLayout(page));
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "shows one bar, the split and the starter preview",
    async () => {
      const page = await openPlayground(DESKTOP);
      expect(await page.locator(".play-bar").count()).toBe(1);
      expect(await page.locator(".code-head").count()).toBe(0);
      expect(await page.locator(".play-views").isVisible()).toBe(false);
      expect(await page.locator(".play-work > section").count()).toBe(2);
      expect(await page.locator(".play-editor .cm-editor").isVisible()).toBe(true);
      expect(await page.locator(".play-preview").isVisible()).toBe(true);
      const frame = page.frameLocator(SHOWN_FRAME);
      await frame.locator("h1").waitFor({ state: "visible", timeout: 15_000 });
      expect((await frame.locator("h1").textContent())?.trim()).toBe("Counter");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "opens the problems panel from the status bar after a compile error",
    async () => {
      const page = await openPlayground(DESKTOP);
      // Line 4 of the starter is `const count = variable(0);`, so this breaks it.
      await page.locator(".cm-content").click();
      await page.keyboard.press("Control+Home");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("End");
      await page.keyboard.type(" const = ;");
      const toggle = page.locator(".play-problem-toggle");
      await toggle.waitFor({ state: "visible", timeout: 10_000 });
      expect((await toggle.textContent())?.trim()).toContain("problem");
      await toggle.click();
      await page.locator("#play-problems").waitFor({ state: "visible" });
      expect(await page.locator(".play-status").isVisible()).toBe(true);
      expect(await page.locator(".play-work #play-problems").count()).toBe(1);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "keeps the split on a narrow desktop window",
    async () => {
      const page = await openPlayground({ width: 900, height: 800 });
      expect(await page.locator(".play-views").isVisible()).toBe(false);
      expect(await page.locator(".play-editor").isVisible()).toBe(true);
      expect(await page.locator(".play-preview").isVisible()).toBe(true);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "shows one pane at a time on a phone",
    async () => {
      const page = await openPlayground(MOBILE);
      expectNoScroll(await readLayout(page));
      expect(await page.locator(".play-editor").isVisible()).toBe(true);
      expect(await page.locator(".play-preview").isVisible()).toBe(false);

      const views = page.locator(".play-views");
      await views.getByRole("button", { name: "Preview" }).click();
      await page.locator(".play-preview").waitFor({ state: "visible" });
      await page.locator('main.playground[data-view="preview"]').waitFor();
      expect(await page.locator(".play-editor").isVisible()).toBe(false);
      expectNoScroll(await readLayout(page));

      await views.getByRole("button", { name: "Code" }).click();
      await page.locator(".play-editor").waitFor({ state: "visible" });
      await page.locator('main.playground[data-view="code"]').waitFor();
      expect(await page.locator(".play-preview").isVisible()).toBe(false);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "adds a tab and deletes it through the More menu",
    async () => {
      const page = await openPlayground(DESKTOP);
      const tabs = page.locator(".play-bar .code-tab");
      expect(await tabs.count()).toBe(1);

      await page.getByRole("button", { name: "New file" }).click();
      await page.getByLabel("New file name").fill("Extra.lusia");
      await page.getByRole("button", { name: "Add", exact: true }).click();
      await page.waitForFunction(
        () => document.querySelectorAll(".play-bar .code-tab").length === 2,
      );
      expect((await tabs.nth(1).textContent())?.trim()).toContain("Extra.lusia");

      page.on("dialog", (dialog) => void dialog.accept());
      await page.getByLabel("More playground actions").click();
      await page.getByRole("button", { name: "Delete file" }).click();
      await page.waitForFunction(
        () => document.querySelectorAll(".play-bar .code-tab").length === 1,
      );
      expect((await tabs.first().textContent())?.trim()).toContain("App.lusia");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "gives the page scroll and the site chrome back on the Guide",
    async () => {
      const page = await openPlayground(DESKTOP);
      await page.locator(".main-menu").getByRole("link", { name: "Guide" }).click();
      await page.locator(".content").waitFor({ state: "visible", timeout: 15_000 });
      await page.waitForFunction(
        () =>
          document.documentElement.dataset.route === "guide" &&
          document.documentElement.scrollHeight > window.innerHeight + 1,
      );
      expect(await page.locator(".status-strip").isVisible()).toBe(true);
      expect(await page.locator(".site-footer").isVisible()).toBe(true);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );
});

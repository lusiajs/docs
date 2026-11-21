import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { chromium, type Browser, type Page } from "playwright";
import {
  BUILD_TIMEOUT_MS,
  TEST_TIMEOUT_MS,
  openSitePage,
  serveSite,
  type SiteServer,
} from "./serve.ts";

const TOTAL_ENTRIES = 53;
const KIND_LINKS = [12, 19, 6, 7, 9];
const SHOWN_CARDS = "[data-ref-entry]:not([hidden])";

const launch = await chromium
  .launch({ executablePath: process.env.LUSIA_CHROMIUM || undefined })
  .then((browser) => ({ browser, reason: "" }))
  .catch((error: Error) => ({ browser: null, reason: error.message.split("\n")[0] }));
const browser: Browser | null = launch.browser;
const suite = browser ? describe : describe.skip;

let site: SiteServer | undefined;

beforeAll(async () => {
  if (browser) site = await serveSite(["/guide", "/reference"]);
}, BUILD_TIMEOUT_MS);

afterAll(async () => {
  await browser?.close();
  site?.close();
});

async function open(path: string): Promise<Page> {
  const page = await openSitePage(browser!);
  await page.goto(`${site!.base}${path}`);
  return page;
}

async function waitForCards(page: Page): Promise<void> {
  await page.waitForFunction(
    (total) => document.querySelectorAll("[data-ref-entry]").length === total,
    TOTAL_ENTRIES,
    { timeout: 15_000 },
  );
}

async function waitForCount(page: Page, text: string): Promise<void> {
  await page.waitForFunction(
    (expected) => document.querySelector("[data-ref-count]")?.textContent === expected,
    text,
    { timeout: 5_000 },
  );
}

async function openReference(): Promise<Page> {
  const page = await open("/reference");
  await waitForCards(page);
  await waitForCount(page, "53 entries");
  return page;
}

async function countText(page: Page): Promise<string> {
  return (await page.locator("[data-ref-count]").textContent())?.trim() ?? "";
}

function visibleCards(page: Page) {
  return page.locator(SHOWN_CARDS);
}

suite("Reference page after the lazy mount", () => {
  test(
    "shows every card and group, with the exact count",
    async () => {
      const page = await openReference();
      expect(await page.locator("[data-ref-group]:not([hidden])").count()).toBe(5);
      expect(await page.locator("[data-ref-group][hidden]").count()).toBe(0);
      expect(await page.locator("[data-ref-empty]").isVisible()).toBe(false);
      expect(await countText(page)).toBe("53 entries");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "lists the five kind groups in the sidebar with every link",
    async () => {
      const page = await openReference();
      const groups = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-index-group]")]
          .filter((group) => !group.hidden)
          .map((group) => ({
            kind: group.dataset.indexGroup,
            links: group.querySelectorAll("a").length,
          })),
      );
      expect(groups.map((group) => group.kind)).toEqual([
        "function",
        "markup",
        "style",
        "value",
        "type",
      ]);
      expect(groups.map((group) => group.links)).toEqual(KIND_LINKS);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "filters the cards by text and counts the matches",
    async () => {
      const page = await openReference();
      await page.fill("#ref-filter", "variable");
      await page.waitForFunction(
        () => document.querySelector("[data-ref-count]")?.textContent?.endsWith(" of 53 entries"),
        undefined,
        { timeout: 5_000 },
      );
      const shown = await page.evaluate(() => {
        const cards = [...document.querySelectorAll<HTMLElement>("[data-ref-entry]:not([hidden])")];
        return {
          count: cards.length,
          all: cards.every((card) => (card.dataset.search ?? "").includes("variable")),
        };
      });
      expect(shown.all).toBe(true);
      expect(shown.count).toBeGreaterThan(0);
      expect(shown.count).toBeLessThan(TOTAL_ENTRIES);
      expect(await countText(page)).toBe(`${shown.count} of 53 entries`);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "filters by the function chip and toggles it off",
    async () => {
      const page = await openReference();
      await page.fill("#ref-filter", "");
      const chip = page.locator('[data-ref-kind="function"]');
      await chip.click();
      const shown = await page.evaluate(() => {
        const cards = [...document.querySelectorAll<HTMLElement>("[data-ref-entry]:not([hidden])")];
        return {
          count: cards.length,
          all: cards.every((card) => card.dataset.kind === "function"),
        };
      });
      expect(shown.all).toBe(true);
      expect(shown.count).toBe(12);
      expect(await countText(page)).toBe("12 of 53 entries");
      await chip.click();
      expect(await visibleCards(page).count()).toBe(53);
      expect(await countText(page)).toBe("53 entries");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "shows the empty state and clears the filters",
    async () => {
      const page = await openReference();
      await page.fill("#ref-filter", "zzz-no-match");
      await page.locator("[data-ref-empty]").waitFor({ state: "visible" });
      await page.locator("[data-ref-clear]").click();
      expect(await visibleCards(page).count()).toBe(53);
      expect(await page.locator("[data-ref-empty]").isVisible()).toBe(false);
      expect(await page.locator("#ref-filter").inputValue()).toBe("");
      expect(await countText(page)).toBe("53 entries");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "copies the anchor of a card that mounted lazily",
    async () => {
      const page = await openSitePage(browser!);
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text: string) => {
              (window as unknown as { __copied?: string }).__copied = text;
            },
          },
        });
      });
      await page.goto(`${site!.base}/reference`);
      await waitForCards(page);
      await page.locator("#attach .ref-anchor").click();
      await page.waitForFunction(
        () =>
          document.querySelector("#attach .ref-anchor .material-symbols-rounded")?.textContent ===
          "check",
        undefined,
        { timeout: 5_000 },
      );
      const copied = await page.evaluate(
        () => (window as unknown as { __copied?: string }).__copied,
      );
      expect(copied?.endsWith("#attach")).toBe(true);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "scrolls a deep link to its lazy card and marks it in the sidebar",
    async () => {
      const page = await open("/reference#variable");
      await waitForCards(page);
      await page.waitForTimeout(500);
      const result = await page.evaluate(() => {
        const target = document.getElementById("variable");
        const link = document.querySelector<HTMLAnchorElement>(
          '#sidebar a[href="/reference#variable"]',
        );
        return {
          exists: target !== null,
          top: target?.getBoundingClientRect().top ?? -1,
          hash: location.hash,
          current: link?.getAttribute("aria-current") ?? null,
        };
      });
      expect(result.exists).toBe(true);
      expect(result.top).toBeGreaterThanOrEqual(0);
      expect(result.top).toBeLessThan(200);
      expect(result.hash).toBe("#variable");
      expect(result.current).toBe("true");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "marks the sidebar link of a card below the top after scrolling",
    async () => {
      const page = await openReference();
      await page.evaluate(() => {
        const target = document.getElementById("variable")!;
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 120);
      });
      await page.waitForFunction(
        () =>
          document
            .querySelector('#sidebar a[href="/reference#variable"]')
            ?.getAttribute("aria-current") === "true",
        undefined,
        { timeout: 5_000 },
      );
      const current = await page.evaluate(
        () =>
          document
            .querySelector('#sidebar a[href="/reference#variable"]')
            ?.getAttribute("aria-current") ?? null,
      );
      expect(current).toBe("true");
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );
});

suite("Guide page after the lazy mount", () => {
  test(
    "marks a demo's sub-link and moves the indicator after scrolling",
    async () => {
      const page = await open("/guide");
      await page.waitForFunction(
        () => document.querySelectorAll(".demo-block").length > 0,
        undefined,
        {
          timeout: 15_000,
        },
      );
      const demoId = await page.evaluate(() => {
        const block = [...document.querySelectorAll<HTMLElement>(".demo-block")].find((el) =>
          document.querySelector(`#sidebar a[href$="#${el.id}"]`),
        );
        return block?.id ?? null;
      });
      if (!demoId) throw new Error("the Guide needs a demo with a sidebar link");
      await page.evaluate((id) => {
        const demo = document.getElementById(id)!;
        window.scrollTo(0, demo.getBoundingClientRect().top + window.scrollY - 120);
      }, demoId);
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`#sidebar a[href="/guide#${id}"]`)
            ?.getAttribute("aria-current") === "true" &&
          document.querySelector(".nav-indicator")?.classList.contains("is-ready") === true,
        demoId,
        { timeout: 5_000 },
      );
      const state = await page.evaluate(
        (id) => ({
          current:
            document
              .querySelector(`#sidebar a[href="/guide#${id}"]`)
              ?.getAttribute("aria-current") ?? null,
          ready: document.querySelector(".nav-indicator")?.classList.contains("is-ready") ?? false,
        }),
        demoId,
      );
      expect(state).toEqual({ current: "true", ready: true });
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );
});

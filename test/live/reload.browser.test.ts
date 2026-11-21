import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { chromium, type Browser, type ElementHandle, type Locator, type Page } from "playwright";
import {
  BUILD_TIMEOUT_MS,
  TEST_TIMEOUT_MS,
  openSitePage,
  serveSite,
  type SiteServer,
} from "./serve.ts";

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
  if (browser) site = await serveSite(["/guide"]);
}, BUILD_TIMEOUT_MS);

afterAll(async () => {
  await browser?.close();
  site?.close();
});

async function openDemo(page: Page, id: string): Promise<Locator> {
  await page.goto(`${site!.base}/guide`);
  const block = page.locator(`#${id}`);
  await block.scrollIntoViewIfNeeded();
  return block;
}

async function isConnected(handle: ElementHandle): Promise<boolean> {
  return await handle.evaluate((node) => node.isConnected);
}

suite("reload button on a Guide demo", () => {
  test(
    "a normal demo starts over with a fresh instance",
    async () => {
      const page = await openSitePage(browser!);
      const block = await openDemo(page, "event-handlers");
      await block.locator(".status", { hasText: "Clicked 0 of 5 times." }).waitFor();
      await block.locator(".add").click();
      await block.locator(".add").click();
      await block.locator(".status", { hasText: "Clicked 2 of 5 times." }).waitFor();
      const before = await block.locator(".events").elementHandle();

      await block.getByRole("button", { name: "Run again" }).click();

      await block.locator(".status", { hasText: "Clicked 0 of 5 times." }).waitFor();
      expect(await isConnected(before!)).toBe(false);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );

  test(
    "an edited demo runs its edited code again in a new frame",
    async () => {
      const page = await openSitePage(browser!);
      const block = await openDemo(page, "event-handlers");
      await block.locator(".cm-content").click();
      await page.keyboard.press("Control+End");
      await page.keyboard.type(" ");
      const frame = block.frameLocator(SHOWN_FRAME);
      await frame.locator(".status", { hasText: "Clicked 0 of 5 times." }).waitFor();
      await frame.locator(".add").click();
      await frame.locator(".add").click();
      await frame.locator(".status", { hasText: "Clicked 2 of 5 times." }).waitFor();
      const before = await block.locator(SHOWN_FRAME).elementHandle();

      await block.getByRole("button", { name: "Run again" }).click();

      await block
        .frameLocator(SHOWN_FRAME)
        .locator(".status", { hasText: "Clicked 0 of 5 times." })
        .waitFor();
      expect(await isConnected(before!)).toBe(false);
      await page.close();
    },
    TEST_TIMEOUT_MS,
  );
});

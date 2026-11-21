import { describe, expect, test } from "bun:test";
import { createDemoSession } from "../../src/live/demo-session.ts";
import type { LiveBundle } from "../../src/live/types.ts";

const FILE = "src/Box.lusia";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("createDemoSession rerun", () => {
  test("builds and shows the edited files again without waiting for the edit delay", async () => {
    const shown: LiveBundle[] = [];
    const session = createDemoSession([{ name: FILE, code: "<p>original</p>" }], {
      show: async (bundle) => {
        shown.push(bundle);
        return { ok: true };
      },
      restore: () => {},
    });
    session.edit(FILE, "<p>changed</p>");
    session.rerun();
    await delay(50);
    expect(shown.length).toBe(1);
    expect(Object.values(shown[0]!.modules).join("\n")).toContain('"<p>changed</p>"');

    session.rerun();
    await delay(50);
    expect(shown.length).toBe(2);
  });
});

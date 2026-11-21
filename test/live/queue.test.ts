import { describe, expect, test } from "bun:test";
import { createQueue } from "../../src/live/queue.ts";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("createQueue", () => {
  test("a task waits for the task before it, even when that one is slower", async () => {
    const queue = createQueue();
    const order: string[] = [];
    queue(async () => {
      await delay(20);
      order.push("first");
    });
    queue(() => order.push("second"));
    await delay(40);
    expect(order).toEqual(["first", "second"]);
  });
});

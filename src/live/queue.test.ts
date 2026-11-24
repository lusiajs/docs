import { describe, expect, test } from "bun:test";
import { createQueue } from "./queue.ts";

describe("createQueue", () => {
  test("runs tasks in order, each after the last one finishes", async () => {
    const run = createQueue();
    const order: string[] = [];
    run(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      order.push("first");
    });
    await run(() => order.push("second"));
    expect(order).toEqual(["first", "second"]);
  });

  test("keeps running after a task fails", async () => {
    const run = createQueue();
    const ran: string[] = [];
    const original = console.error;
    console.error = () => {};
    try {
      run(() => {
        throw new Error("boom");
      });
      await run(() => ran.push("after"));
    } finally {
      console.error = original;
    }
    expect(ran).toEqual(["after"]);
  });
});

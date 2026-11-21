import { afterEach, describe, expect, test } from "bun:test";
import CommentThread from "../src/demos/components/CommentThread.lusia";
import FileTree from "../src/demos/components/FileTree.lusia";
import { host, mount, resetMounts } from "../../test/runtime/dom/fixtures/mount.ts";

afterEach(resetMounts);

describe("recursive components in the Guide demos", () => {
  test("the file tree shows every folder and file at its depth", () => {
    const el = host();
    mount(FileTree, el);
    expect(el.querySelectorAll(".file").length).toBe(5);
    expect(el.querySelectorAll(".row").length).toBe(4);
  });

  test("collapsing a folder removes the rows inside it", () => {
    const el = host();
    mount(FileTree, el);
    el.querySelectorAll<HTMLElement>(".row")[1]!.click();
    expect(el.querySelectorAll(".file").length).toBe(1);
  });

  test("replies stop at depth 3, even when the data goes deeper", () => {
    const el = host();
    mount(CommentThread, el);
    expect(el.querySelectorAll(".comment").length).toBe(4);
    expect(el.querySelector(".hidden")?.textContent).toContain("depth 3");
  });
});

import { beforeEach, describe, expect, test } from "bun:test";
import { initCopy } from "./copy.ts";

let copied: string[] = [];

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: (text: string) => {
      copied.push(text);
      return Promise.resolve();
    },
  },
});

function copyButton(text: string): { button: HTMLButtonElement; glyph: HTMLElement } {
  const button = document.createElement("button");
  button.className = "copy-button";
  button.dataset.copy = text;
  const glyph = document.createElement("span");
  glyph.className = "material-symbols-rounded";
  glyph.textContent = "content_copy";
  button.append(glyph);
  return { button, glyph };
}

function click(element: Element): void {
  element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  copied = [];
});

describe("initCopy", () => {
  test("copies from a button that mounts after init", async () => {
    const root = document.createElement("div");
    document.body.append(root);
    const controller = new AbortController();
    initCopy(root, controller.signal);

    const { button, glyph } = copyButton("const answer = 42;");
    root.append(button);
    click(glyph);
    await settle();

    expect(copied).toEqual(["const answer = 42;"]);
    expect(glyph.textContent).toBe("check");
    root.remove();
  });

  test("abort removes the listener", async () => {
    const root = document.createElement("div");
    document.body.append(root);
    const controller = new AbortController();
    initCopy(root, controller.signal);
    controller.abort();

    const { button, glyph } = copyButton("never copied");
    root.append(button);
    click(glyph);
    await settle();

    expect(copied).toEqual([]);
    expect(glyph.textContent).toBe("content_copy");
    root.remove();
  });
});

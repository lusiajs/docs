import { beforeEach, describe, expect, test } from "bun:test";
import { copyText, initCopy } from "./copy.ts";

let copied: string[] = [];
let refusing = false;

Object.defineProperty(navigator, "clipboard", {
	configurable: true,
	value: {
		writeText: (text: string) => {
			if (refusing) return Promise.reject(new Error("refused"));
			copied.push(text);
			return Promise.resolve();
		},
	},
});

function copyButton(text: string): {
	button: HTMLButtonElement;
	glyph: HTMLElement;
} {
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
	refusing = false;
});

describe("copyText", () => {
	test("writes the text and resolves true", async () => {
		expect(await copyText("bun add lusiajs")).toBe(true);
		expect(copied).toEqual(["bun add lusiajs"]);
	});

	test("resolves false when the browser refuses", async () => {
		refusing = true;
		expect(await copyText("bun add lusiajs")).toBe(false);
		expect(copied).toEqual([]);
	});
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

	test("copies data-copy from a plain button", async () => {
		const root = document.createElement("div");
		document.body.append(root);
		const controller = new AbortController();
		initCopy(root, controller.signal);

		const button = document.createElement("button");
		button.dataset.copy = "starter prompt";
		const glyph = document.createElement("span");
		glyph.className = "material-symbols-rounded";
		button.append(glyph);
		root.append(button);
		click(glyph);
		await settle();

		expect(copied).toEqual(["starter prompt"]);
		root.remove();
	});

	test("copies before a demo swaps its code panel", async () => {
		const root = document.createElement("div");
		document.body.append(root);
		const controller = new AbortController();
		initCopy(root, controller.signal);

		const lazyCode = document.createElement("div");
		lazyCode.className = "lazy-code";
		const { button, glyph } = copyButton("from the demo");
		lazyCode.append(button);
		// The demo's own bubble handler swaps the panel for the editor and ends the bubble.
		lazyCode.addEventListener("click", (event) => {
			event.stopPropagation();
			lazyCode.replaceChildren();
		});
		root.append(lazyCode);
		click(glyph);
		await settle();

		expect(copied).toEqual(["from the demo"]);
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

import { beforeAll, describe, expect, test } from "bun:test";
import type { Component } from "lusiajs";
import { startRouter, type PageSpec } from "./router.ts";

// A stand-in page: attaches one element and removes it when detached.
const fakePage = ((target: Element) => {
	const root = document.createElement("section");
	target.append(root);
	return { root, detach: async () => root.remove() };
}) as unknown as Component;

// A page whose load waits for the test to finish it or fail it.
function gatedPage(path: string, title: string) {
	let settle: (page: Component) => void = () => {};
	let fail: (error: unknown) => void = () => {};
	let loads = 0;
	const spec: PageSpec = {
		path,
		route: path.slice(1),
		title,
		mount: () => {},
		load: () => {
			loads++;
			return new Promise<Component>((resolve, reject) => {
				settle = resolve;
				fail = reject;
			});
		},
	};
	return {
		spec,
		finish: () => settle(fakePage),
		fail: (error: unknown) => fail(error),
		loads: () => loads,
	};
}

let guideLoads = 0;
const slow = gatedPage("/slow", "Slow");
const late = gatedPage("/late", "Late");
const broken = gatedPage("/broken", "Broken");
const specs: PageSpec[] = [
	{
		path: "/",
		route: "home",
		title: "Home",
		load: () => Promise.resolve(fakePage),
		mount: () => {},
	},
	{
		path: "/guide",
		route: "guide",
		title: "Guide",
		load: () => {
			guideLoads++;
			return Promise.resolve(fakePage);
		},
		mount: () => {},
	},
	{
		path: "/fast",
		route: "fast",
		title: "Fast",
		load: () => Promise.resolve(fakePage),
		mount: () => {},
	},
	slow.spec,
	late.spec,
	broken.spec,
];

// The page URL setter of happy-dom, which the DOM typings do not declare.
function happyDOM(): { setURL(url: string): Promise<void> } {
	return (
		window as unknown as {
			happyDOM: { setURL(url: string): Promise<void> };
		}
	).happyDOM;
}

function click(link: HTMLAnchorElement): MouseEvent {
	const event = new MouseEvent("click", {
		bubbles: true,
		cancelable: true,
		button: 0,
	});
	link.dispatchEvent(event);
	return event;
}

function linkTo(href: string): HTMLAnchorElement {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = href;
	document.body.append(link);
	return link;
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// The loading fallback fades out for 200 ms before the page takes its place.
const FADE_MS = 300;

function outlet(): HTMLElement {
	return document.querySelector<HTMLElement>("#outlet")!;
}

function fallbackShown(): boolean {
	return outlet().querySelector(".page-loading") !== null;
}

function buttonNamed(name: string): HTMLButtonElement | undefined {
	return [...outlet().querySelectorAll("button")].find(
		(button) => button.textContent.trim() === name,
	);
}

beforeAll(async () => {
	await happyDOM().setURL("http://localhost/");
	history.replaceState(null, "", "/guide");
	document.body.innerHTML = `<header class="topbar"></header><nav class="main-menu"><a href="/slow">Slow</a><a href="/fast">Fast</a></nav><div id="outlet"></div><h2 id="alpha">Alpha</h2>`;
	await startRouter(document.querySelector("#outlet")!, specs);
});

describe("router", () => {
	test("a link to the page on screen only changes the hash", async () => {
		const loadsBefore = guideLoads;
		const event = click(linkTo("/guide#alpha"));
		expect(event.defaultPrevented).toBe(true);
		expect(location.pathname).toBe("/guide");
		expect(location.hash).toBe("#alpha");
		expect(guideLoads).toBe(loadsBefore);
	});

	test("a link to another page swaps the page", async () => {
		click(linkTo("/"));
		await wait(0);
		expect(location.pathname).toBe("/");
		expect(document.title).toBe("Home");
	});

	test("a slow page shows the loading fallback, then the page", async () => {
		click(linkTo("/slow"));
		expect(document.title).toBe("Slow");
		expect(document.querySelector('.main-menu a[href="/slow"]')?.getAttribute("aria-current")).toBe(
			"page",
		);
		await wait(250);
		expect(fallbackShown()).toBe(true);
		slow.finish();
		await wait(FADE_MS);
		expect(fallbackShown()).toBe(false);
		expect(outlet().querySelectorAll("section").length).toBe(1);
		expect(document.documentElement.dataset.route).toBe("slow");
	});

	test("a fast page never shows the loading fallback", async () => {
		let fallbacksAdded = 0;
		const observer = new MutationObserver((records) => {
			for (const record of records)
				for (const node of record.addedNodes)
					if (node instanceof Element && node.matches(".page-loading")) fallbacksAdded++;
		});
		observer.observe(outlet(), { childList: true, subtree: true });
		click(linkTo("/fast"));
		await wait(250);
		observer.disconnect();
		expect(fallbacksAdded).toBe(0);
		expect(document.title).toBe("Fast");
	});

	test("a newer navigation removes the fallback of an abandoned one", async () => {
		click(linkTo("/late"));
		await wait(250);
		expect(fallbackShown()).toBe(true);
		click(linkTo("/fast"));
		await wait(FADE_MS);
		expect(fallbackShown()).toBe(false);
		expect(document.title).toBe("Fast");
		late.finish();
		await wait(FADE_MS);
		expect(late.loads()).toBe(1);
		expect(document.title).toBe("Fast");
		expect(fallbackShown()).toBe(false);
	});

	test("Try again loads the page after a failed load", async () => {
		click(linkTo("/broken"));
		broken.fail(new TypeError("network down"));
		await wait(20);
		expect(outlet().querySelector(".page-error")).not.toBeNull();
		buttonNamed("Try again")?.click();
		await wait(20);
		expect(broken.loads()).toBe(2);
		broken.finish();
		await wait(20);
		expect(outlet().querySelector(".page-error")).toBeNull();
		expect(document.title).toBe("Broken");
	});
});

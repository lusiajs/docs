import { beforeAll, describe, expect, test } from "bun:test";
import type { Component } from "lusia";
import { startRouter, type PageSpec } from "./router.ts";
import { initTopbar } from "./topbar.ts";

// A stand-in page: attaches one element and removes it when detached.
const fakePage = ((target: Element) => {
	const root = document.createElement("section");
	target.append(root);
	return { root, detach: async () => root.remove() };
}) as unknown as Component;

let guideLoads = 0;
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

beforeAll(async () => {
	await happyDOM().setURL("http://localhost/");
	history.replaceState(null, "", "/guide");
	document.body.innerHTML = `<header class="topbar"></header><nav class="main-menu"></nav><div id="outlet"></div><h2 id="alpha">Alpha</h2>`;
	initTopbar();
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
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(location.pathname).toBe("/");
		expect(document.title).toBe("Home");
	});
});

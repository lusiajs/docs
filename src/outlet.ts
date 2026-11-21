import { attach, type Component, type Instance, type Props } from "lusiajs";
import type { PageSpec } from "./router.ts";

// What the outlet shows: a page, or the loading or error fallback (no spec).
export interface Screen {
	instance: Instance;
	controller: AbortController;
	spec?: PageSpec;
}

let element: HTMLElement;
let screen: Screen | undefined;
// Outlet changes run one after another, so a page never attaches while the old one is still leaving.
let queue: Promise<void> = Promise.resolve();

export function setOutlet(target: HTMLElement): void {
	element = target;
}

export function outletElement(): HTMLElement {
	return element;
}

export function currentScreen(): Screen | undefined {
	return screen;
}

export function inOutlet(task: () => Promise<void>): Promise<void> {
	queue = queue.then(task).catch((error: unknown) => console.error(error));
	return queue;
}

// Takes the screen first, so no other step can detach it again while it leaves.
export async function detachScreen(): Promise<void> {
	if (!screen) return;
	const leaving = screen;
	screen = undefined;
	leaving.controller.abort();
	await leaving.instance.detach();
}

export function attachScreen(component: Component, props?: Props, spec?: PageSpec): Screen {
	const controller = new AbortController();
	const instance = attach(component, element, props);
	screen = { instance, controller, spec };
	return screen;
}

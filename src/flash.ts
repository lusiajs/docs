import { controller, type Controller } from "lusia";

const headings = new Map<string, Controller>();

// One controller per section heading. A keyword chip that links to the section plays it.
export function headingFlash(id: string): Controller {
	let ctl = headings.get(id);
	if (!ctl) {
		ctl = controller();
		headings.set(id, ctl);
	}
	return ctl;
}

export async function flashHeading(id: string): Promise<void> {
	const ctl = headings.get(id);
	if (!ctl) return;
	await ctl.play();
	await ctl.reverse();
}

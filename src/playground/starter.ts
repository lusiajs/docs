import { counter } from "./presets/counter.ts";
import type { PlayFile } from "./types.ts";

export function starterFiles(): PlayFile[] {
	return counter.files.map((file) => ({ ...file }));
}

import { variable } from "lusia";
import type { EditorJump } from "../editor/files.ts";
import type { LiveError } from "../live/types.ts";
import { ENTRY_FILE } from "./names.ts";
import { loadFiles } from "./storage.ts";
import type { PlayFile } from "./types.ts";

export const files = variable<PlayFile[]>(loadFiles());
export const active = variable(ENTRY_FILE);
export const autoRun = variable(true);
export const compileErrors = variable<LiveError[]>([]);
export const runtimeErrors = variable<LiveError[]>([]);
export const jump = variable<EditorJump | null>(null);
export const notice = variable("");
export const errors = variable.compute(() => [...compileErrors.value, ...runtimeErrors.value]);

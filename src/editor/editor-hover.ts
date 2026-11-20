import { childProps, type EditorFile } from "./files.ts";
import { hoverAt, scriptHover, type HoverResult } from "../../../editors/shared/hover.ts";

/** The hover for `offset`. A .ts file is all script, so it skips the markup rules. */
export function editorHover(
  text: string,
  offset: number,
  fileName: string,
  files: readonly EditorFile[],
): HoverResult | undefined {
  if (fileName.endsWith(".ts")) return scriptHover(text, offset);
  return hoverAt(text, offset, (name) => childProps(files, fileName, text, name) ?? []);
}

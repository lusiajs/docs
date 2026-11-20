import { childProps, childSymbols, type EditorFile } from "./files.ts";
import { hoverAt, scriptHover, type HoverResult } from "../../../editors/shared/hover.ts";
import type { SymbolLookup } from "../../../editors/shared/script/imported-symbols.ts";

/** The hover for `offset`. A .ts file is all script, so it skips the markup rules. */
export function editorHover(
  text: string,
  offset: number,
  fileName: string,
  files: readonly EditorFile[],
): HoverResult | undefined {
  const symbolsOf: SymbolLookup = (specifier) => childSymbols(files, fileName, specifier);
  if (fileName.endsWith(".ts")) return scriptHover(text, offset, symbolsOf);
  const propsOf = (name: string) => childProps(files, fileName, text, name) ?? [];
  return hoverAt(text, offset, propsOf, symbolsOf);
}

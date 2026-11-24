import type { Extension } from "@codemirror/state";
import { hoverTooltip, type Tooltip } from "@codemirror/view";
import { hoverMarkdown } from "lusiajs/editor/markdown.ts";
import { docsElement } from "./docs-dom.ts";
import { editorHover } from "./editor-hover.ts";
import type { EditorFile } from "./files.ts";

const HOVER_DELAY_MS = 300;

/** Hover docs from reference/api.ts, and the props of an imported component. */
export function lusiaHover(fileName: string, getFiles: () => readonly EditorFile[]): Extension {
  return hoverTooltip(
    (view, pos): Tooltip | null => {
      const text = view.state.doc.toString();
      const result = editorHover(text, pos, fileName, getFiles());
      if (!result) return null;
      const markdown = hoverMarkdown(result);
      return {
        pos,
        above: true,
        create: () => ({ dom: docsElement(markdown) }),
      };
    },
    { hoverTime: HOVER_DELAY_MS },
  );
}

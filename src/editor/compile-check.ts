import { compileParts } from "lusiajs/compiler/pipeline.ts";

const NO_STYLE = { css: "", deps: [], sassMs: 0 };

/**
 * Runs the compiler's own steps with an empty style step: Sass does not run in the browser,
 * so style errors are not reported here. Throws the same LusiaError the build would throw.
 */
export function compileWithoutStyles(source: string, file: string): void {
  compileParts(source, file, {
    dev: false,
    displayFile: file,
    styles: () => NO_STYLE,
  });
}

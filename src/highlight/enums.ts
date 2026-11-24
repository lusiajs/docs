import Prism from "./prism.ts";

// EVENT.VIEW, SCREEN.X and EDGE.TOP are names the framework provides, so they get their own token.
export function registerEnums(): void {
  Prism.languages.insertBefore("typescript", "keyword", {
    constant: /\b(?:EVENT|SCREEN|EDGE)\.[A-Z_]+\b/,
  });
}

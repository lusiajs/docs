import type { Plugin } from "prettier";
import { protectExpressions, restoreExpressions } from "./format-expressions.ts";

type Formatter = {
  format: (code: string, options: { parser: string; plugins: Plugin[] }) => Promise<string>;
  plugins: Plugin[];
};

let formatter: Promise<Formatter> | undefined;

// Prettier is large, so it loads on the first format, not when the editor opens.
function loadFormatter(): Promise<Formatter> {
  formatter ??= Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/estree"),
    import("prettier/plugins/html"),
    import("prettier/plugins/postcss"),
    import("prettier/plugins/typescript"),
  ]).then(([standalone, estree, html, postcss, typescript]) => ({
    format: standalone.format,
    plugins: [estree, html, postcss, typescript] as Plugin[],
  }));
  return formatter;
}

export function formatScript(code: string): Promise<string> {
  return formatCode(code, "typescript");
}

export function formatStyle(code: string, plainCss: boolean): Promise<string> {
  return formatCode(code, plainCss ? "css" : "scss");
}

export async function formatMarkup(markup: string): Promise<string> {
  const protectedMarkup = protectExpressions(markup);
  const { format, plugins } = await loadFormatter();
  const formatted = await format(protectedMarkup.text, { parser: "html", plugins });
  return restoreExpressions(formatted, protectedMarkup.expressions).trim();
}

async function formatCode(code: string, parser: "typescript" | "css" | "scss"): Promise<string> {
  if (code.trim() === "") return "";
  const { format, plugins } = await loadFormatter();
  return (await format(code, { parser, plugins })).trim();
}

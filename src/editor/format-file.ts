import { formatScript } from "./format-parts.ts";
import { formatLucia } from "./format.ts";

/** Formats a file the way the extension formats .lucia files, and .ts files as plain TypeScript. */
export async function formatFile(name: string, code: string): Promise<string> {
  if (!name.endsWith(".ts")) return formatLucia(code);
  const formatted = await formatScript(code);
  return formatted === "" ? "" : `${formatted}\n`;
}

import { formatLusia, formatScript } from "./format.ts";

/** Formats a file the way the extension formats .lusia files, and .ts files as plain TypeScript. */
export async function formatFile(name: string, code: string): Promise<string> {
	if (!name.endsWith(".ts")) return formatLusia(code);
	const formatted = await formatScript(code);
	return formatted === "" ? "" : `${formatted}\n`;
}

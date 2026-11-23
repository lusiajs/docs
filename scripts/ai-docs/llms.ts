import type { ApiEntry } from "lusiajs/api";
import { orderedEntries } from "./api-order.ts";
import { apiPagePath, configPagePath, errorsPagePath, indexPagePath } from "./paths.ts";
import type { DocFiles } from "./links.ts";
import { rebaseLinks } from "./links.ts";

const SEPARATOR = "\n---\n\n";

function versionLine(version: string): string {
  return `Version: ${version}`;
}

function apiLine(entry: ApiEntry): string {
  return `- [${entry.name}](${apiPagePath(entry.id)}): ${entry.summary}`;
}

export function buildLlmsTxt(entries: ApiEntry[], description: string, version: string): string {
  const lines = [
    "# Lusia",
    "",
    `> ${description}`,
    "",
    versionLine(version),
    "",
    "## Start here",
    "",
    `- [Docs index](${indexPagePath}): every API page, error code and config option.`,
    "",
    "## API",
    "",
    ...orderedEntries(entries).map(apiLine),
    "",
    "## Errors",
    "",
    `- [Error codes](${errorsPagePath}): every error code with its message and hint.`,
    "",
    "## Config",
    "",
    `- [Config options](${configPagePath}): every option for lusia.config.json.`,
  ];
  return `${lines.join("\n")}\n`;
}

// The index first, then the API pages, errors and config.
function fullRank(path: string): number {
  if (path === indexPagePath) return 0;
  if (path.startsWith(apiPagePath(""))) return 1;
  if (path === errorsPagePath) return 2;
  return 3;
}

function isFullPage(path: string): boolean {
  return path.startsWith("docs/") && path.endsWith(".md");
}

export function buildLlmsFullTxt(files: DocFiles, version: string): string {
  const pages = [...files]
    .filter(([path]) => isFullPage(path))
    .sort(([left], [right]) => fullRank(left) - fullRank(right) || left.localeCompare(right));
  const parts = pages.map(([path, content]) => rebaseLinks(content, path).trimEnd());
  return `${versionLine(version)}\n\n${parts.join(SEPARATOR)}\n`;
}

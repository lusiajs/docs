import { apiPagePath } from "../scripts/ai-docs/paths.ts";

// The site serves the generated files from its root, so the URL is the file path with a leading slash.
export function entryMarkdownUrl(id: string): string {
  return `/${apiPagePath(id)}`;
}

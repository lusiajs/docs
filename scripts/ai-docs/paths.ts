// Paths of the generated files, relative to the site root. The generator writes them and the site links to them.
export const indexPagePath = "docs/README.md";
export const errorsPagePath = "docs/errors.md";
export const configPagePath = "docs/config.md";
export const llmsTxtPath = "llms.txt";
export const llmsFullTxtPath = "llms-full.txt";

export function apiPagePath(id: string): string {
  return `docs/api/${id}.md`;
}

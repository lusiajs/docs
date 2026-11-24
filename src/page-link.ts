// Page paths of the docs site. Links to a section always name the page, because the <base href="/"> would make "#id" point at Home.
export const homePath = "/";
export const guidePath = "/guide";
export const referencePath = "/reference";
export const playgroundPath = "/playground";
export const errorsPath = "/errors";

export function pageLink(path: string, id: string): string {
  return `${path}#${id}`;
}

// Drops a trailing slash, so "/guide/" and "/guide" name the same page.
export function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

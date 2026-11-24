import { normalizePath } from "./page-link.ts";
import type { PageSpec } from "./router.ts";

// The page a same-origin link points to, or undefined for any other link.
export function pageForLink(link: HTMLAnchorElement, pages: PageSpec[]): PageSpec | undefined {
  if (link.origin !== location.origin) return undefined;
  const path = normalizePath(link.pathname);
  return pages.find((page) => page.path === path);
}

// Gives each built route its own title, description, canonical URL and sitemap entry.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const SITE = "https://lusia.azpepoze.com";

const HOME_DESCRIPTION =
  "Lusia (lusiajs) is a small JavaScript UI framework. Write .lusia components with markup, style and variables in one file. Guide, API reference, playground and error codes.";

export type Route = { path: string; title: string; description: string };

export const routes: Route[] = [
  {
    path: "/",
    title: "Lusia JS - a small UI framework with .lusia components",
    description: HOME_DESCRIPTION,
  },
  {
    path: "/guide",
    title: "Guide - Lusia JS framework",
    description:
      "Learn the Lusia JS framework step by step: components, variables, events, lists and animation, each with a live demo.",
  },
  {
    path: "/reference",
    title: "API Reference - Lusia JS framework",
    description: "Every Lusia JS API entry, option and type, with examples.",
  },
  {
    path: "/playground",
    title: "Playground - Lusia JS framework",
    description: "Write and run Lusia JS components in your browser. No install needed.",
  },
  {
    path: "/errors",
    title: "Error codes - Lusia JS framework",
    description: "What each Lusia JS error code means and how to fix it.",
  },
];

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function canonicalUrl(route: Route): string {
  return SITE + route.path;
}

function setMeta(html: string, key: string, name: string, value: string): string {
  const matcher = new RegExp(`\\b${key}="${name}"`);
  return html.replace(/<meta\b[^>]*>/g, (tag) =>
    matcher.test(tag) ? tag.replace(/\bcontent="[^"]*"/, () => `content="${esc(value)}"`) : tag,
  );
}

function jsonLd(route: Route): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lusia",
    alternateName: "lusiajs",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: route.description,
    url: canonicalUrl(route),
    codeRepository: "https://github.com/lusiajs/lusia",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  // Keeps a "</script>" inside the JSON from closing the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function headTags(route: Route): string[] {
  const url = esc(canonicalUrl(route));
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Lusia" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
  ];
  if (route.path === "/") tags.push(jsonLd(route));
  return tags;
}

export function pageHtml(baseHtml: string, route: Route): string {
  let html = baseHtml.replace(/<meta\s[^>]*\bcharset=[^>]*>\s*/gi, "");
  html = html.replace(/<head[^>]*>/i, (head) => `${head}\n    <meta charset="utf-8" />`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${esc(route.title)}</title>`);
  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.description);
  const head = headTags(route).join("\n    ");
  html = html.replace(/\s*<\/head>/i, () => `\n    ${head}\n  </head>`);
  return html;
}

export function sitemapXml(date: string): string {
  const urls = routes
    .map((route) => `  <url>\n    <loc>${esc(canonicalUrl(route))}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

if (import.meta.main) {
  const baseHtml = readFileSync("dist/index.html", "utf8");
  for (const route of routes) {
    const file = join("dist", route.path, "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageHtml(baseHtml, route));
    console.log(`wrote ${file}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync("dist/sitemap.xml", sitemapXml(today));
  console.log("wrote dist/sitemap.xml");
  writeFileSync("dist/robots.txt", robotsTxt());
  console.log("wrote dist/robots.txt");
}

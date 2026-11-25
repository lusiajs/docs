import { describe, expect, test } from "bun:test";
import { pageHtml, robotsTxt, routes, sitemapXml, SITE } from "../scripts/seo.ts";

const base = `<!doctype html>
<html lang="en">
  <head>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description"
      content="old description" />
    <meta property="og:title" content="Lusia" />
    <meta
      property="og:description"
      content="old description"
    />
    <title>Lusia</title>
  </head>
  <body>
    <div id="loader" class="loader-static" role="status">
      <div class="loader-inner">
        <p class="name">Lusia</p>
      </div>
    </div>
  </body>
</html>
`;

function titleOf(html: string): string {
  return html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
}

describe("seo pages", () => {
  test("each route gets a unique title", () => {
    const titles = routes.map((route) => titleOf(pageHtml(base, route)));
    expect(new Set(titles).size).toBe(routes.length);
  });

  test("canonical URL matches the route", () => {
    const guide = routes.find((route) => route.path === "/guide");
    if (!guide) throw new Error("missing /guide route");
    const html = pageHtml(base, guide);
    expect(html).toContain(`<link rel="canonical" href="${SITE}/guide" />`);
    expect(html).toContain(`<meta property="og:url" content="${SITE}/guide" />`);
  });

  test("home canonical has a trailing slash", () => {
    const home = routes[0];
    if (!home) throw new Error("missing home route");
    expect(pageHtml(base, home)).toContain(`<link rel="canonical" href="${SITE}/" />`);
  });

  test("charset is the first element in head", () => {
    for (const route of routes) {
      expect(pageHtml(base, route)).toMatch(/<head>\s*<meta charset="utf-8" \/>/);
    }
  });

  test("description and og metas are replaced", () => {
    const html = pageHtml(base, routes[1]!);
    expect(html).toContain(`content="${routes[1]!.description}"`);
    expect(html).not.toContain("old description");
    expect(html).toContain(`<meta property="og:title" content="${routes[1]!.title}" />`);
  });

  test("JSON-LD is only on the home page", () => {
    const [home, ...others] = routes;
    expect(pageHtml(base, home!)).toContain('<script type="application/ld+json">');
    for (const route of others) {
      expect(pageHtml(base, route)).not.toContain("application/ld+json");
    }
  });

  test("escapes inserted text", () => {
    const html = pageHtml(base, {
      path: "/x",
      title: 'A "quoted" <b>',
      description: "Tom & Jerry",
    });
    expect(titleOf(html)).toBe("A &quot;quoted&quot; &lt;b&gt;");
    expect(html).toContain("Tom &amp; Jerry");
  });
});

describe("sitemap and robots", () => {
  test("sitemap lists the 5 canonical URLs", () => {
    const xml = sitemapXml("2026-01-01");
    const locs = xml.match(/<loc>[^<]*<\/loc>/g) ?? [];
    expect(locs).toHaveLength(5);
    expect(xml).toContain(`<loc>${SITE}/errors</loc>`);
    expect(xml).toContain("<lastmod>2026-01-01</lastmod>");
  });

  test("robots points to the sitemap", () => {
    expect(robotsTxt()).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});

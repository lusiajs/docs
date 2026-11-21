import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BunFile } from "bun";
import type { Browser, Page } from "playwright";

export const BUILD_TIMEOUT_MS = 120_000;
export const TEST_TIMEOUT_MS = 30_000;

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SITE = ROOT;

export interface SiteServer {
  base: string;
  close: () => void;
}

// Blocks external https requests (Google Fonts) so pages do not wait for the network.
export async function openSitePage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  page.setDefaultTimeout(TEST_TIMEOUT_MS);
  await page.route(/^https:\/\//, (route) => route.abort());
  return page;
}

async function runBun(args: string[]): Promise<void> {
  const proc = Bun.spawn(["bun", ...args], { cwd: ROOT, stdout: "ignore", stderr: "pipe" });
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`bun ${args.join(" ")} failed: ${await Bun.readableStreamToText(proc.stderr)}`);
  }
}

// The first file that exists: the path itself, then its index.html.
async function findFile(out: string, path: string): Promise<BunFile | null> {
  for (const candidate of [join(out, path), join(out, path, "index.html")]) {
    const file = Bun.file(candidate);
    if (await file.exists()) return file;
  }
  return null;
}

function serveFolder(out: string): Server {
  return createServer(async (request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const file = await findFile(out, path);
    if (!file) {
      response.statusCode = 404;
      response.end();
      return;
    }
    response.setHeader("content-type", file.type);
    response.end(Buffer.from(await file.arrayBuffer()));
  });
}

// Builds the docs site into a temp folder and serves it, as the static site would be served.
export async function serveSite(routes: string[]): Promise<SiteServer> {
  const out = await mkdtemp(join(tmpdir(), "lusia-site-"));
  await runBun(["scripts/playground-runtime.ts"]);
  await runBun([
    "../src/cli/index.ts",
    "build",
    SITE,
    "--outdir",
    out,
    "--routes",
    routes.join(","),
  ]);
  const server = serveFolder(out);
  await new Promise<void>((resolve) => server.listen(0, "localhost", resolve));
  const address = server.address() as AddressInfo;
  return {
    base: `http://localhost:${address.port}`,
    close: () => {
      server.close();
    },
  };
}

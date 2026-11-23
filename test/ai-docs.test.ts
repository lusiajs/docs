import { beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { api } from "lusiajs/api";
import { CODES } from "lusiajs/errors/codes.ts";
import { entryMarkdownUrl } from "../src/ai-docs.ts";
import { generateDocs } from "../scripts/ai-docs/generate.ts";
import { findBrokenLinks } from "../scripts/ai-docs/links.ts";
import { configSchema } from "../scripts/ai-docs/source.ts";
import { apiPagePath, llmsTxtPath } from "../scripts/ai-docs/paths.ts";

const WORDS_THAT_MEAN_A_BUG = ["undefined", "[object Object]"];
const LLMS_LINK = /\]\(([^)\s]+)\)/g;

let firstDir = "";
let secondDir = "";
let writtenFiles: string[] = [];

async function readDoc(outputDir: string, path: string): Promise<string> {
  return readFile(join(outputDir, path), "utf8");
}

// The source text itself may use these words, so a line passes when it is in the source.
function sourceText(): string {
  return JSON.stringify({ api, codes: CODES, schema: configSchema });
}

function isInSource(line: string, source: string): boolean {
  const text = line.replace(/^\s*(- )?/, "");
  return source.includes(JSON.stringify(text).slice(1, -1));
}

beforeAll(async () => {
  firstDir = await mkdtemp(join(tmpdir(), "lusia-ai-docs-a-"));
  secondDir = await mkdtemp(join(tmpdir(), "lusia-ai-docs-b-"));
  writtenFiles = await generateDocs(firstDir);
  await generateDocs(secondDir);
});

describe("generated docs", () => {
  test("writes one api page per entry", async () => {
    const pages = await readdir(join(firstDir, "docs", "api"));
    expect(pages.length).toBe(api.length);
  });

  test("errors.md has a row for every code", async () => {
    const errors = await readDoc(firstDir, "docs/errors.md");
    for (const code of Object.keys(CODES)) {
      expect(errors).toContain(`| ${code} |`);
    }
  });

  test("config.md lists the nested animate.attach.animateSpace option", async () => {
    const config = await readDoc(firstDir, "docs/config.md");
    expect(config).toContain("animate.attach.animateSpace");
  });

  test("every link in llms.txt points to a file that exists", async () => {
    const llms = await readDoc(firstDir, llmsTxtPath);
    const targets = [...llms.matchAll(LLMS_LINK)].map((match) => match[1] ?? "");
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(existsSync(join(firstDir, target))).toBe(true);
    }
  });

  test("every link in every generated page points to a written file", async () => {
    const pages = await Promise.all(
      writtenFiles.map(async (path) => [path, await readDoc(firstDir, path)] as const),
    );
    expect(findBrokenLinks(new Map(pages))).toEqual([]);
  });

  test("the broken-link check reports a link to a missing page", () => {
    const files = new Map([["docs/README.md", "[Gone](api/missing.md)"]]);
    expect(findBrokenLinks(files)).toEqual(["docs/README.md links to api/missing.md"]);
  });

  test("two runs produce byte-identical files", async () => {
    for (const path of writtenFiles) {
      const first = await readFile(join(firstDir, path));
      const second = await readFile(join(secondDir, path));
      expect(Buffer.compare(first, second)).toBe(0);
    }
  });

  test("no page has a bug word that the source does not contain", async () => {
    const source = sourceText();
    for (const path of writtenFiles) {
      const lines = (await readDoc(firstDir, path)).split("\n");
      for (const line of lines) {
        const hasBugWord = WORDS_THAT_MEAN_A_BUG.some((word) => line.includes(word));
        if (hasBugWord) expect(isInSource(line, source)).toBe(true);
      }
    }
  });
});

describe("copy for LLM mapping", () => {
  test("every API entry's button URL is a file the generator writes", () => {
    for (const entry of api) {
      const url = entryMarkdownUrl(entry.id);
      expect(writtenFiles).toContain(url.slice(1));
    }
  });

  test("every API entry's button URL exists in the output folder", () => {
    for (const entry of api) {
      expect(existsSync(join(firstDir, entryMarkdownUrl(entry.id).slice(1)))).toBe(true);
    }
  });

  test("the button URL is the page path with a leading slash", () => {
    const first = api[0];
    expect(first).toBeDefined();
    expect(entryMarkdownUrl(first!.id)).toBe(`/${apiPagePath(first!.id)}`);
  });
});

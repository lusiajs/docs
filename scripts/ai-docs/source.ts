import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchemaDefs, SchemaNode } from "./config-options.ts";

// package.json is not in the lusiajs exports map, so the root is found from the api entry instead.
const packageRoot = join(dirname(fileURLToPath(import.meta.resolve("lusiajs/api"))), "..");

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(packageRoot, path), "utf8")) as T;
}

export const packageJson = readJson<{ description: string; version: string }>("package.json");

export const configSchema = readJson<SchemaNode & { $defs?: SchemaDefs }>("config.schema.json");

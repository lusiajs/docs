import { api } from "lusiajs/api";
import { CODES } from "lusiajs/errors/codes.ts";
import { buildApiPage } from "./api-page.ts";
import { buildConfigPage } from "./config-page.ts";
import { buildErrorsPage } from "./errors-page.ts";
import { buildIndexPage } from "./index-page.ts";
import { buildLlmsFullTxt, buildLlmsTxt } from "./llms.ts";
import type { DocFiles } from "./links.ts";
import {
  apiPagePath,
  configPagePath,
  errorsPagePath,
  indexPagePath,
  llmsFullTxtPath,
  llmsTxtPath,
} from "./paths.ts";
import { configSchema, packageJson } from "./source.ts";

const INTRO_SUFFIX =
  " These pages are generated from the API reference, the error codes and the config schema.";

function addFile(files: DocFiles, path: string, content: string): void {
  if (files.has(path)) throw new Error(`Two docs pages write ${path}`);
  files.set(path, content);
}

// Every file the package ships, keyed by its path from the package root.
export function buildDocFiles(): DocFiles {
  const files: DocFiles = new Map();
  const { description, version } = packageJson;
  addFile(files, indexPagePath, buildIndexPage(api, description + INTRO_SUFFIX, version));
  for (const entry of api) {
    addFile(files, apiPagePath(entry.id), buildApiPage(entry, api));
  }
  addFile(files, errorsPagePath, buildErrorsPage(CODES));
  addFile(files, configPagePath, buildConfigPage(configSchema));
  addFile(files, llmsTxtPath, buildLlmsTxt(api, description, version));
  addFile(files, llmsFullTxtPath, buildLlmsFullTxt(files, version));
  return files;
}

// Writes the AI docs into public/, so the site serves them at /llms.txt and /docs/. Run from docs/ before `dev` and `build`.
import { fileURLToPath } from "node:url";
import { generateDocs } from "./ai-docs/generate.ts";

const OUTDIR = fileURLToPath(new URL("../public", import.meta.url));

await generateDocs(OUTDIR);

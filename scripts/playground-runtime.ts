// Writes the Lusia runtime that the playground preview loads. Run from docs/ before `dev` and `build`.
const ENTRY = "src/playground/runtime.ts";
const OUTDIR = "public/playground";

export {};

const result = await Bun.build({
	entrypoints: [ENTRY],
	outdir: OUTDIR,
	naming: "lusia.js",
	target: "browser",
	format: "esm",
	minify: true,
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}

import type { Importer } from "sass";

// Sass cannot read files from disk in the browser, so imports resolve inside the project.
export function scssImporter(
	fromName: string,
	project: ReadonlyMap<string, string>,
): Importer {
	return {
		canonicalize(url, context) {
			const from = context.containingUrl ?? toFileUrl(fromName);
			const target = new URL(url, from).pathname.slice(1);
			const found = scssCandidates(target).find((name) =>
				project.has(name),
			);
			return found === undefined ? null : toFileUrl(found);
		},
		load(canonicalUrl) {
			const text = project.get(canonicalUrl.pathname.slice(1));
			return text === undefined
				? null
				: { contents: text, syntax: "scss" };
		},
	};
}

// `@use "../styles/demo"` can mean `demo.scss` or the partial `_demo.scss`.
function scssCandidates(path: string): string[] {
	if (path.endsWith(".scss")) return [path];
	const slash = path.lastIndexOf("/");
	const folder = path.slice(0, slash + 1);
	const name = path.slice(slash + 1);
	return [`${path}.scss`, `${folder}_${name}.scss`];
}

function toFileUrl(path: string): URL {
	return new URL(`file:///${path}`);
}

import { compileScssText } from "lusia/compiler/style/sass-browser.ts";
import scrollReadoutTs from "../demos/motion/scroll-readout.ts?raw";
import type { EditorFile } from "../editor/files.ts";
import demoScss from "../styles/_demo.scss?raw";
import themeScss from "../styles/_theme.scss?raw";
import themeTs from "../theme.ts?raw";
import variableTs from "../variable.ts?raw";
import { buildLive, type BuildResult } from "./build.ts";
import { rootNames } from "./imports.ts";
import { scssImporter } from "./scss.ts";

// Site files that demos import without listing them. A demo's own file with the same name wins.
const sharedFiles: EditorFile[] = [
	{ name: "src/styles/_theme.scss", code: themeScss },
	{ name: "src/styles/_demo.scss", code: demoScss },
	{ name: "src/theme.ts", code: themeTs },
	{ name: "src/variable.ts", code: variableTs },
	{ name: "src/demos/motion/scroll-readout.ts", code: scrollReadoutTs },
];

// The same :root rule the site uses, so the frame gets the theme's color variables.
const ROOT_NAME = "src/styles/root.scss";
const ROOT_SCSS = `@use "theme" as *;\n:root {\n  @include vars;\n}\n`;

let themeCss: string | undefined;

/** Builds one demo's files with the site's shared files and theme. Loaded on the first edit only. */
export function buildDemo(demoFiles: readonly EditorFile[]): BuildResult {
	const own = new Set(demoFiles.map((file) => file.name));
	const files = [
		...demoFiles,
		...sharedFiles.filter((file) => !own.has(file.name)),
	];
	return buildLive(files, {
		entries: rootNames(demoFiles),
		styles: theme(),
	});
}

function theme(): string {
	themeCss ??= compileRootTheme();
	return themeCss;
}

function compileRootTheme(): string {
	const project = new Map(sharedFiles.map((file) => [file.name, file.code]));
	const importers = [scssImporter(ROOT_NAME, project)];
	return compileScssText(ROOT_SCSS, ROOT_NAME, importers);
}

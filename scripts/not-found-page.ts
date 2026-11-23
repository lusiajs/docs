// GitHub Pages serves dist/404.html for any missing path. The copy points its assets at "/" so they load from any depth.
import { readFileSync, writeFileSync } from "node:fs";

const indexPath = "dist/index.html";
const notFoundPath = "dist/404.html";

const html = readFileSync(indexPath, "utf8");
writeFileSync(notFoundPath, html.replace(/(href|src)="\.\//g, '$1="/'));
console.log(`wrote ${notFoundPath}`);

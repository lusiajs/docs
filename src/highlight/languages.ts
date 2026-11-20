import Prism from "./prism.ts";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-scss.js";
import { registerLusia } from "./lusia.ts";

registerLusia();

export default Prism;

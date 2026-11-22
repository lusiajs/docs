import Prism from "./prism.ts";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-typescript.js";
import { registerEnums } from "./enums.ts";
import { registerLusia } from "./lusia.ts";

registerEnums();
registerLusia();

export default Prism;

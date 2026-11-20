import Prism from "prismjs";

// The Prism language components read the global `Prism`, so expose it before they load.
Object.assign(globalThis, { Prism });

export default Prism;

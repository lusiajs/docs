import { defineConfig } from "lusiajs/config";
import { EASE, MIDWAY } from "lusiajs";

export default defineConfig({
  outdir: "dist",
  minify: true,
  animate: {
    duration: 400,
    ease: [EASE.STYLE.QUART, EASE.INOUT],
    midway: { mode: MIDWAY.RESTART },
    in: "FADE_IN",
    out: "FADE_OUT",
  },
});

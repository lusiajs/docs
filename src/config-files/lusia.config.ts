import { defineConfig } from "lusiajs/config";
import { EASE, MIDWAY, TURN } from "lusiajs";

export default defineConfig({
  outdir: "dist",
  minify: true,
  animate: {
    duration: 400,
    ease: [EASE.STYLE.QUART, EASE.INOUT],
    midway: { play: MIDWAY.RESTART, turn: TURN.SMOOTH },
    in: "FADE_IN",
    out: "FADE_OUT",
  },
});

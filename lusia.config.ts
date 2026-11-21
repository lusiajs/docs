import { defineConfig } from "lusia/config";
import { EASE, MIDWAY, TURN } from "lusia";

export default defineConfig({
  outdir: "dist",
  minify: true,
  routes: ["/guide", "/reference", "/playground", "/errors"],
  animate: {
    duration: 400,
    ease: [EASE.STYLE.CUBIC, EASE.OUT],
    midway: { play: MIDWAY.RESTART, turn: TURN.SMOOTH },
    in: "FADE_IN",
    out: "FADE_OUT",
  },
});

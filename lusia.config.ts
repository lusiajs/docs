import { EASE, MIDWAY, PRESET } from "lusiajs";
import { defineConfig } from "lusiajs/config";

export default defineConfig({
  outdir: "dist",
  minify: true,
  routes: ["/guide", "/reference", "/playground", "/errors"],
  // PHONE ends at 559px, TABLET at 899px. Same names as the defaults, so the types need no generated file.
  screens: { PHONE: 0, TABLET: 560, DESKTOP: 900 },
  animate: {
    duration: 400,
    ease: [EASE.STYLE.QUART, EASE.INOUT],
    midway: { mode: MIDWAY.SWITCH_SMOOTH },
    in: PRESET.FADE_IN,
    out: PRESET.FADE_OUT,
    attach: { animateSpace: false },
    detach: { animateSpace: false },
  },
});

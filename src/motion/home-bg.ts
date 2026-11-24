import { EASE, EDGE, ON, PRESET, type Keyframes, type Style } from "lusiajs";
import { scrollAcross, type Follow } from "./home-scroll.ts";

// Linear, or the site's default QUART INOUT ease keeps the layers still for the first screens.
const PAGE_EASE: Keyframes["ease"] = [EASE.STYLE.LINEAR, EASE.IN];

// Progress is 0 at the page top on screen and 1 when the page bottom meets the screen bottom.
export function pageScroll(follow: Follow, from: Style, to: Style) {
  return scrollAcross(follow, from, to, [EDGE.TOP, 0], [EDGE.BOTTOM, 1], PAGE_EASE);
}

const raysSpinKeys = {
  0: { rotate: "0deg" },
  1: [EASE.STYLE.LINEAR, EASE.INOUT, { rotate: "360deg" }],
};
export const raysSpin = {
  play: raysSpinKeys,
  loop: true,
  duration: 120000,
};

export function tunnelIn(index: number) {
  return {
    play: {
      0: { scale: "0.6", opacity: 0 },
      1: [EASE.STYLE.QUART, EASE.OUT, { scale: "1", opacity: 1 }],
    },
    on: ON.ATTACH,
    duration: 600,
    delay: index * 40,
    keep: false,
  };
}

export const tunnelOut = {
  play: {
    0: { scale: "1", opacity: 1 },
    1: [EASE.STYLE.QUART, EASE.IN, { scale: "1.4", opacity: 0 }],
  },
  on: ON.DETACH,
  duration: 250,
};

// Opacity only: a transform here would pin the fixed backdrop to the page box while it plays.
export const backdropFade = [
  { play: PRESET.FADE_IN, on: ON.ATTACH, duration: 450, keep: false },
  { play: PRESET.FADE_OUT, on: ON.DETACH, duration: 250 },
];

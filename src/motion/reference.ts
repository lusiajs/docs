import { controller, EASE, ON, PRESET } from "lusiajs";

// The detail card fades in and rises 16 px each time it is shown.
const cardKeys = {
  ease: [EASE.STYLE.QUART, EASE.OUT],
  0: { opacity: 0, translate: "0px 16px" },
  1: { opacity: 1, translate: "0px 0px" },
};

// Rows and cards leave by fading out.
const fadeOut = {
  0: { opacity: 1 },
  1: { opacity: 0 },
};

const gridKeys = {
  ease: [EASE.STYLE.QUART, EASE.IN],
  0: { opacity: 1, translate: "0px 0px" },
  1: { opacity: 0, translate: "0px 12px" },
};

export const gridController = controller();

// The tile grid sinks and fades when a controller plays it, and rises back when reversed.
export const gridMotion = {
  play: gridKeys,
  on: ON.MANUAL,
  control: gridController,
  duration: 220,
};

export const cardMotion = [
  { play: PRESET.SLIDE_UP, on: ON.ATTACH, duration: 300 },
  { play: fadeOut, on: ON.DETACH, duration: 200 },
  { play: cardKeys, on: ON.VIEW, duration: 380, options: { reverse: true } },
];

const borderKeys = {
  0: { borderColor: "var(--line)" },
  1: { borderColor: "var(--group)" },
};

export const tileHoverMotion = { play: borderKeys, on: ON.HOVER, duration: 220 };

import { EASE, ON } from "lusiajs";

// Page transitions. The engine names are wrapped here, so a rename is a one-place change.
// The old page leaves first (250 ms), then the new page enters (450 ms). They never overlap,
// so the layout does not jump.
const pageOutKeys = {
  ease: [EASE.STYLE.QUART, EASE.IN],
  0: { opacity: 1, translate: "0px 0px" },
  1: { opacity: 0, translate: "0px -16px" },
};

const pageInKeys = {
  ease: [EASE.STYLE.QUART, EASE.OUT],
  0: { opacity: 0, translate: "0px 24px" },
  1: { opacity: 1, translate: "0px 0px" },
};

export const pageIn = {
  play: pageInKeys,
  on: ON.ATTACH,
  duration: 450,
  keep: false,
};
export const pageOut = {
  play: pageOutKeys,
  on: ON.DETACH,
  duration: 250,
};
export const pageMotion = [pageIn, pageOut];

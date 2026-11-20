import { WHEN, EASE } from "lusia";

// Page transitions. The engine names are wrapped here, so a rename is a one-place change.
// The old page leaves first (250 ms), then the new page enters (450 ms). They never overlap,
// so the layout does not jump.
const pageOutKeys = {
  default: [EASE.STYLE.QUART, EASE.IN],
  0: { opacity: 1, translate: "0px 0px", scale: 1 },
  1: { opacity: 0, translate: "0px -16px", scale: 0.98 },
};

const pageInKeys = {
  default: [EASE.STYLE.QUART, EASE.OUT],
  0: { opacity: 0, translate: "0px 24px" },
  1: { opacity: 1, translate: "0px 0px" },
};

export const pageIn = { style: pageInKeys, when: WHEN.ATTACH, duration: 450, keep: false };
export const pageOut = { style: pageOutKeys, when: WHEN.DETACH, duration: 250, more: { keepSpace: true } };
export const pageMotion = [pageIn, pageOut];

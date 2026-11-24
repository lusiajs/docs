import { EASE } from "lusiajs";

// Same wobble as the title letters. Static logos use the matching CSS keyframes.
export const wobbleStyle = {
  ease: [EASE.STYLE.SINE, EASE.OUT],
  0: { rotate: "0deg" },
  0.25: { rotate: "-14deg" },
  0.5: { rotate: "10deg" },
  0.75: { rotate: "-5deg" },
  1: { rotate: "0deg" },
};

import { EASE, MIDWAY, TURN } from "lusia";
import { defineConfig } from "lusia/config";

export default defineConfig({
	outdir: "dist",
	minify: true,
	routes: ["/guide", "/reference", "/playground", "/errors"],
	animate: {
		duration: 400,
		ease: [EASE.STYLE.QUART, EASE.INOUT],
		midway: { play: MIDWAY.TURN, turn: TURN.SMOOTH },
		in: "FADE_IN",
		out: "FADE_OUT",
	},
});

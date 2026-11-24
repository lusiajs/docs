import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { ON, EASE } from "lusiajs";

  // With no start or end, the range is the card entering and leaving the screen.
  const rise = {
    0: { opacity: 0, filter: "blur(12px)" },
    1: [EASE.STYLE.LINEAR, EASE.OUT, { opacity: 1, filter: "blur(0px)" }],
  };

  const riseMotion = { play: rise, on: ON.SCROLL };
</script>

<main class="app">
  <h1>Scroll</h1>
  <p>Scroll down. Each card fades in as it reaches the screen.</p>
  <div class="space">
    <div class="card" animate={riseMotion}>Card one</div>
  </div>
  <div class="space">
    <div class="card" animate={riseMotion}>Card two</div>
  </div>
  <div class="space">
    <div class="card" animate={riseMotion}>Card three</div>
  </div>
</main>

<style>
  .app {
    max-width: 28rem;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
  }

  .space {
    display: grid;
    align-items: center;
    height: 80vh;
  }

  .card {
    width: fit-content;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    background: #2563eb;
    color: #ffffff;
  }
</style>
`;

export const scroll: Preset = {
  id: "scroll",
  title: "Scroll",
  description: "Cards that fade in while you scroll.",
  files: [{ name: ENTRY_FILE, code: APP }],
};

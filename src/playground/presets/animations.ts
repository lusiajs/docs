import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { variable, PRESET, ON } from "lusiajs";

  const shown = variable(true);

  // The card fades in when it appears and fades out when it is removed.
  const cardMotion = [
    { play: PRESET.FADE_IN, on: ON.ATTACH, duration: 250 },
    { play: PRESET.FADE_OUT, on: ON.DETACH, duration: 200 },
  ];

  const hoverMotion = { play: PRESET.PULSE, on: ON.HOVER, duration: 500 };

  function toggle() {
    shown.value = !shown.value;
  }
</script>

<main class="app">
  <h1>Animations</h1>
  <button type="button" onclick={toggle}>Show or hide the card</button>
  <IF {shown}>
    <div class="card" animate={cardMotion}>This card fades in and out.</div>
  </IF>
  <p class="hover" animate={hoverMotion}>Hover over this line.</p>
</main>

<style>
  .app {
    display: grid;
    gap: 0.75rem;
    max-width: 28rem;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
  }

  .card {
    padding: 1rem;
    border-radius: 12px;
    background: #2563eb;
    color: #ffffff;
  }

  .hover {
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: #f3e8ff;
  }
</style>
`;

export const animations: Preset = {
  id: "animations",
  title: "Animations",
  description: "Fade a card in and out, and pulse a line on hover.",
  files: [{ name: ENTRY_FILE, code: APP }],
};

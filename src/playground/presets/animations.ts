import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { variable, PRESET, WHEN } from "lusiajs";

  const shown = variable(true);

  // The card fades in when it appears and fades out when it is removed.
  const cardMotion = [
    { style: PRESET.FADE_IN, when: WHEN.ATTACH, duration: 250 },
    { style: PRESET.FADE_OUT, when: WHEN.DETACH, duration: 200 },
  ];

  const hoverMotion = { style: PRESET.PULSE, when: WHEN.HOVER, duration: 500 };

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

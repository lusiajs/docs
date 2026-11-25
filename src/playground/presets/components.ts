import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { variable } from "lusiajs";
  import Badge from "./Badge.lusia";

  const warn = variable(false);
  const tone = variable.compute(() => (warn.value ? "warn" : "info"));
  const label = variable.compute(() => "Tone is " + tone.value);

  function toggleTone() {
    warn.value = !warn.value;
  }
</script>

<main class="app">
  <h1>Components</h1>
  <button type="button" onclick={toggleTone}>Toggle tone</button>
  <p>Passed value, read by the child: <Badge label={label} tone={tone} /></p>
  <p>No value passed, so the defaults are used: <Badge /></p>
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
</style>
`;

const BADGE = `<script>
  import { props } from "lusiajs";

  const { label, tone } = props(class {
    label = "New";
    tone = "info";
  });
</script>

<span class="badge {tone}">{label}</span>

<style>
  .badge {
    display: inline-block;
    padding: 0 0.6rem;
    border: 1px solid #d4d4d8;
    border-radius: 999px;
    color: #52525b;
    font-size: 0.9rem;
  }

  .badge.info {
    border-color: #2563eb;
    color: #2563eb;
  }

  .badge.warn {
    border-color: #dc2626;
    color: #dc2626;
  }
</style>
`;

export const components: Preset = {
  id: "components",
  title: "Components",
  description: "A child component that takes props from its parent.",
  files: [
    { name: ENTRY_FILE, code: APP },
    { name: "Badge.lusia", code: BADGE },
  ],
};

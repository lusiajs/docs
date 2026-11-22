import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<main class="app">
  <h1>Hello, Lusia</h1>
  <p>Edit this file to start.</p>
</main>

<style>
  .app {
    max-width: 28rem;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
  }
</style>
`;

export const blank: Preset = {
  id: "blank",
  title: "Blank",
  description: "One file with a heading. Start from here.",
  files: [{ name: ENTRY_FILE, code: APP }],
};

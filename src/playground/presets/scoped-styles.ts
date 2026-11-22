import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import Note from "./Note.lusia";
</script>

<main class="app">
  <h1>Scoped styles</h1>
  <p>This paragraph is blue. The plain p rule also reaches the child below.</p>
  <p class="note">This line is underlined by the @scoped rule.</p>
  <Note />
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

  p {
    margin: 0;
    color: #2563eb;
  }

  @scoped {
    .note {
      text-decoration: underline;
    }
  }
</style>
`;

const NOTE = `<div class="note-box">
  <p class="note">Child note: not underlined.</p>
  <p>Child paragraph: blue, from the parent's plain p rule.</p>
</div>

<style scoped>
  .note-box {
    display: grid;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px dashed #d4d4d8;
    border-radius: 8px;
  }
</style>
`;

export const scopedStyles: Preset = {
  id: "scoped-styles",
  title: "Scoped styles",
  description: "Plain, @scoped and scoped rules, with a child component.",
  files: [
    { name: ENTRY_FILE, code: APP },
    { name: "Note.lusia", code: NOTE },
  ],
};

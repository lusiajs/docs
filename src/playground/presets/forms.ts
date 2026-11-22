import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { variable } from "lusiajs";

  const name = variable("");
  const email = variable("");
  const status = variable("");
  const sendDisabled = variable.compute(
    () => name.value.trim() === "" || !email.value.includes("@"),
  );

  function send() {
    status.value = "Thanks, " + name.value.trim() + ". We will write to " + email.value + ".";
  }
</script>

<main class="app">
  <h1>Contact</h1>
  <label>Name <input type="text" bind-value={name} /></label>
  <label>Email <input type="email" bind-value={email} /></label>
  <button type="button" disabled={sendDisabled} onclick={send}>Send</button>
  <p class="status">{status}</p>
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

  label {
    display: grid;
    gap: 0.25rem;
  }

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d4d4d8;
    border-radius: 8px;
    font: inherit;
  }

  .status {
    color: #6e6283;
  }
</style>
`;

export const forms: Preset = {
  id: "forms",
  title: "Forms",
  description: "Read typed text with bind-value and disable a button until it is valid.",
  files: [{ name: ENTRY_FILE, code: APP }],
};

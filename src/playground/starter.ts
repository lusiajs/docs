import { ENTRY_FILE } from "./names.ts";
import type { PlayFile } from "./types.ts";

const STARTER_APP = `<script>
import { variable, PRESET, WHEN } from "lusia";

const count = variable(0);
const items = variable<string[]>(["Apples", "Pears"]);
const draft = variable("");
const label = variable.compute(() => (count.value > 4 ? "Lots of clicks" : "Keep clicking"));

// Each row slides up when it appears in the list.
const rowMotion = { style: PRESET.SLIDE_UP, when: WHEN.ATTACH, duration: 300 };

function increment() {
  count.value++;
}

function add() {
  const name = draft.value.trim();
  if (name === "" || items.value.includes(name)) return;
  items.value = [...items.value, name];
  draft.value = "";
}

function remove(name: string) {
  items.value = items.value.filter((item) => item !== name);
}
</script>

<main class="app">
  <h1>Counter</h1>
  <p class="count">Clicked {count} times. {label}.</p>
  <button type="button" onclick={increment}>Click me</button>

  <h2>List</h2>
  <ul>
    <EACH {items} as={item} key={item}>
      <li animate={rowMotion}>
        {item}
        <button type="button" onclick={() => remove(item)}>Remove</button>
      </li>
    </EACH>
  </ul>
  <div class="row">
    <input type="text" bind={draft} placeholder="New item" />
    <button type="button" onclick={add}>Add</button>
  </div>
</main>

<style lang="css">
.app {
  display: grid;
  gap: 0.75rem;
  max-width: 28rem;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}

.count {
  color: #6e6283;
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.row {
  display: flex;
  gap: 0.5rem;
}
</style>
`;

export function starterFiles(): PlayFile[] {
  return [{ name: ENTRY_FILE, code: STARTER_APP }];
}

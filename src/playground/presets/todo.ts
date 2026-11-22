import { ENTRY_FILE } from "../names.ts";
import type { Preset } from "./index.ts";

const APP = `<script>
  import { variable, PRESET, WHEN } from "lusiajs";

  const tasks = variable<string[]>([]);
  const draft = variable("");
  const hasTasks = variable.compute(() => tasks.value.length > 0);

  const rowMotion = { style: PRESET.SLIDE_UP, when: WHEN.ATTACH, duration: 250 };

  function add() {
    const task = draft.value.trim();
    if (task === "" || tasks.value.includes(task)) return;
    tasks.value = [...tasks.value, task];
    draft.value = "";
  }

  function finish(task: string) {
    tasks.value = tasks.value.filter((item) => item !== task);
  }
</script>

<main class="app">
  <h1>To do</h1>
  <div class="row">
    <input type="text" bind-value={draft} placeholder="What needs doing?" />
    <button type="button" onclick={add}>Add</button>
  </div>
  <IF {hasTasks}>
    <ul>
      <EACH {tasks} as={task} key={task}>
        <li animate={rowMotion}>
          {task}
          <button type="button" onclick={() => finish(task)}>Done</button>
        </li>
      </EACH>
    </ul>
  </IF>
  <ELSE>
    <p class="empty">Nothing to do. Add a task above.</p>
  </ELSE>
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

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    gap: 0.5rem;
  }

  .empty {
    color: #6e6283;
  }
</style>
`;

export const todo: Preset = {
  id: "todo",
  title: "To do",
  description: "Add tasks, mark them done, and see the empty state.",
  files: [{ name: ENTRY_FILE, code: APP }],
};

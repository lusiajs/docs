export const code = `<script>
  import { variable } from "lusiajs";

  const count = variable(0);

  function addOne() {
    count.value++;
  }
</script>

<button onclick={addOne}>Clicked {count} times</button>

<style>
  button {
    padding: 0.5rem 1rem;
  }
</style>`;

const button = (text: string) => [{ id: "button", tag: "button", text }];

export const steps = [
  {
    title: "Lusia compiles the file into code that builds the page",
    lines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    nodes: [],
  },
  {
    title: "The markup becomes DOM nodes",
    lines: [11],
    nodes: button("Clicked 0 times"),
  },
  {
    title: "A click runs addOne()",
    lines: [6, 7],
    nodes: button("Clicked 0 times"),
  },
  {
    title: "count changes, so only the text updates",
    lines: [11],
    nodes: button("Clicked 1 times"),
  },
];

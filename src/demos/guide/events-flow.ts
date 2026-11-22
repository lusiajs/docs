export const code = `<script>
  import { variable } from "lusiajs";

  const name = variable("Ada");

  function swap() {
    name.value = name.value === "Ada" ? "Grace" : "Ada";
  }
</script>

<button onclick={swap}>Swap</button>
<p>Hello, {name}</p>`;

const nodes = (name: string) => [
  { id: "swap", tag: "button", text: "Swap" },
  { id: "greeting", tag: "p", text: "Hello, " + name },
];

export const steps = [
  {
    title: "The page starts with Ada",
    lines: [4, 12],
    nodes: nodes("Ada"),
  },
  {
    title: "A click runs swap()",
    lines: [11, 6, 7],
    nodes: nodes("Ada"),
  },
  {
    title: "name changes, so the text updates",
    lines: [7, 12],
    nodes: nodes("Grace"),
  },
];

export const code = `<script>
  import { variable } from "lusiajs";

  const count = variable(0);
</script>

<p>{count} clicks</p>
<button onclick={() => count.value++}>Add one</button>`;

const nodes = (clicks: string) => [
  { id: "text", tag: "p", text: clicks + " clicks" },
  { id: "button", tag: "button", text: "Add one" },
];

export const steps = [
  {
    title: "variable() holds a value",
    lines: [4],
    nodes: nodes("0"),
  },
  {
    title: "The markup reads count, so it shows 0",
    lines: [7],
    nodes: nodes("0"),
  },
  {
    title: "A click runs count.value++, and only the text updates",
    lines: [8],
    nodes: nodes("1"),
  },
];

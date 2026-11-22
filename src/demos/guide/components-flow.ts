export const code = `<script>
  import Card from "./Card.lusia";
</script>

<Card title="Ada" />
<Card title="Grace" />`;

const ada = [
  {
    id: "ada-card",
    tag: "section",
    children: [{ id: "ada-title", tag: "h2", text: "Ada" }],
  },
];

const both = [
  ...ada,
  {
    id: "grace-card",
    tag: "section",
    children: [{ id: "grace-title", tag: "h2", text: "Grace" }],
  },
];

export const steps = [
  {
    title: "Import a component file",
    lines: [2],
    nodes: [],
  },
  {
    title: "The first tag places one Card",
    lines: [5],
    nodes: ada,
  },
  {
    title: "The second tag places another Card with its own title",
    lines: [6],
    nodes: both,
  },
];

export const code = `<h1>Hello</h1>
<p class="note">Styled here only</p>

<style scoped>
  h1 {
    color: tomato;
  }

  .note {
    font-style: italic;
  }
</style>`;

const nodes = [
  { id: "title", tag: "h1", text: "Hello" },
  { id: "note", tag: "p.note", text: "Styled here only" },
];

export const steps = [
  {
    title: "The markup becomes DOM nodes",
    lines: [1, 2],
    nodes,
  },
  {
    title: "The h1 rule styles the h1 in this file",
    lines: [5, 6],
    nodes,
  },
  {
    title: "The .note rule styles the p with that class",
    lines: [9, 10],
    nodes,
  },
];

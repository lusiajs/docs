export const code = `<script>
  import { PRESET, WHEN, variable } from "lusiajs";

  const shown = variable(true);
</script>

<button onclick={() => (shown.value = !shown.value)}>Toggle</button>
<IF {shown}>
  <p
    animate={[
      { style: PRESET.FADE_IN, when: WHEN.ATTACH },
      { style: PRESET.FADE_OUT, when: WHEN.DETACH },
    ]}
  >
    Hello
  </p>
</IF>`;

const button = { id: "toggle", tag: "button", text: "Toggle" };
const hello = { id: "hello", tag: "p", text: "Hello" };

export const steps = [
  {
    title: "The p fades in when it attaches",
    lines: [9, 10, 11, 12, 13, 14, 15, 16],
    nodes: [button, hello],
  },
  {
    title: "A click detaches the p, and it fades out first",
    lines: [7],
    nodes: [button],
  },
  {
    title: "The next click attaches it again, and it fades in",
    lines: [7, 8],
    nodes: [button, hello],
  },
];

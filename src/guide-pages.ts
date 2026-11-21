import type { ApiEntry } from "lusiajs/api";

// Guide pages that are not api entries. They sit in the Guide only, never in the Reference.
export const introPageId = "lusia-intro";
export const startProjectId = "start-project";
export const lifecyclePageId = "lifecycle";
export const animateSpacePageId = "animate-space-page";

export const guidePages: ApiEntry[] = [
	{
		id: introPageId,
		name: "What is Lusia",
		kind: "markup",
		group: "basics",
		signature: "<style> ... </style>\n<script> ... </script>\n<markup>",
		summary: "Lusia is a UI framework. One .lusia file holds the style, the script and the markup of a component.",
		bullets: [
			"A variable() holds a value. When it changes, only the markup that reads it updates.",
			"Lusia compiles each file. The browser runs the result. There is no virtual DOM.",
			"Use another component by importing its file and writing its tag.",
		],
		example: `<script>
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
</style>`,
	},
	{
		id: startProjectId,
		name: "Start a project",
		kind: "markup",
		group: "basics",
		signature: "bun create lusiajs my-app",
		summary: "Make a new Lusia app, or add Lusia to a project you already have.",
		bullets: [
			"A new app starts with one counter component.",
			"An existing project needs only the lusiajs package.",
		],
		example: "bun create lusiajs my-app",
	},
	{
		id: lifecyclePageId,
		name: "Lifecycle",
		kind: "markup",
		group: "components",
		signature: "attach(Component, element) ... detach()",
		summary: "A component is attached when it joins the page and detached when it leaves. Hooks run at each step.",
		bullets: [
			"attach() and detach() are called by your code, on the instance it returns.",
			"onAttach() and onDetach() are called inside the component's script.",
			"detach() waits for the DETACH animation. The nodes are removed after it.",
		],
		example: `<script>
  import { onAttach, onDetach } from "lusiajs";

  onAttach((root) => {
    console.log("placed in", root);
    return () => console.log("cleanup, before the nodes leave");
  });

  onDetach(() => console.log("the component is gone"));
</script>`,
	},
	{
		id: animateSpacePageId,
		name: "Animate space",
		kind: "markup",
		group: "motion",
		signature: "more: { animateSpace: true }",
		summary: "Slide the neighbors when an element attaches or detaches, instead of letting them jump.",
		bullets: ["Only ATTACH and DETACH use it. The default is false for both."],
		example: "animate={{ style: PRESET.FADE_IN, when: WHEN.ATTACH, more: { animateSpace: true } }}",
	},
];

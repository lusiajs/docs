import type { ApiEntry } from "lusiajs/api";

// Guide pages that are not api entries. They sit in the Guide only, never in the Reference.
export const introPageId = "lusia-intro";
export const startProjectId = "start-project";
export const lifecyclePageId = "lifecycle";
export const animateSpacePageId = "animate-space-page";
export const scrollAtPageId = "scroll-at";

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
		id: "reactivity-overview",
		name: "Variables in the DOM",
		kind: "markup",
		group: "reactivity",
		signature: "variable(value)",
		example: `<script>
  import { variable } from "lusiajs";

  const count = variable(0);
</script>

<p>{count} clicks</p>`,
		summary: "A variable is a value the page watches. Only the text that reads it changes.",
		bullets: [
			"Read a variable in markup with {name}. The text updates after each write.",
			"Write it with .value. A click that writes the variable updates the page.",
		],
	},
	{
		id: "events-overview",
		name: "Events in the DOM",
		kind: "markup",
		group: "events",
		signature: "onclick={handler}",
		example: `<button onclick={swap}>Swap</button>`,
		summary: "An event runs a function. The function can write variables, and the page follows.",
		bullets: [
			"Each click runs the handler once.",
			"The handler writes a variable, so the text that reads it updates.",
		],
	},
	{
		id: "flow-overview",
		name: "Flow in the DOM",
		kind: "markup",
		group: "flow",
		signature: "<IF {condition}> ... </IF>",
		example: `<IF {loggedIn}>
  <p>Welcome back.</p>
<ELSE>
  <p>Please log in.</p>
</IF>`,
		summary: "IF shows one branch of markup. When the condition changes, the other branch leaves.",
		bullets: [
			"Only the branch that matches is in the DOM.",
			"Branches that leave play their DETACH animation first.",
			"One closing </IF> ends the whole chain. Older files close each branch. Run lusia format to convert them.",
		],
	},
	{
		id: "components-overview",
		name: "Components in the DOM",
		kind: "markup",
		group: "components",
		signature: '<Card title="Ada" />',
		example: `<script>
  import Card from "./Card.lusia";
</script>

<Card title="Ada" />`,
		summary: "A component tag places the markup of another .lusia file on the page.",
		bullets: [
			"Each tag places its own copy of the component.",
			"A name must not be an HTML tag. row works, but button does not. The error suggests a name such as ButtonBox.",
			"Props pass values in. The child shows them in its own markup.",
		],
	},
	{
		id: "styling-overview",
		name: "Styles in the DOM",
		kind: "markup",
		group: "styling",
		signature: "<style scoped> ... </style>",
		example: `<style scoped>
  h1 {
    color: tomato;
  }
</style>`,
		summary: "A style block sets the look of the markup in the same file. The DOM keeps the same nodes.",
		bullets: [
			"Scoped rules match only the markup of their own component.",
			"Tree rules also reach the child components inside it.",
		],
	},
	{
		id: "screen-sizes",
		name: "Screen sizes",
		kind: "markup",
		group: "styling",
		signature: "SCREEN.PHONE  |  @include screen(PHONE)",
		summary: "Change the look for each window size. Use SCREEN in markup, or the screen() mixin in a style.",
		bullets: [
			"Three sizes come by default: PHONE, TABLET and DESKTOP. Each one starts at a width in px.",
			"SCREEN.PHONE is on while the window is in the PHONE size. Use it in <IF>.",
			"A <style> inside an <IF> applies only in that branch.",
			"@include screen(PHONE) wraps rules in the style of that size. Use it for plain rules.",
			"Set your own sizes with screens in lusia.config. Names are UPPER_SNAKE_CASE.",
			"lusia dev and lusia build write .lusia/screens.d.ts, so SCREEN knows your names. Add .lusia to tsconfig include.",
		],
		example: `<IF {SCREEN.PHONE}>
  <p>Phone</p>
<ELSE>
  <p>Wider</p>
</IF>

<IF {SCREEN.PHONE}>
  <style>
    .card {
      padding: 8px;
    }
  </style>
<ELSE>
  <style>
    .card {
      padding: 24px;
    }
  </style>
</IF>

<style>
  @include screen(PHONE) {
    .card {
      padding: 8px;
    }
  }
</style>`,
	},
	{
		id: "motion-overview",
		name: "Motion in the DOM",
		kind: "markup",
		group: "motion",
		signature: "animate={{ style, when }}",
		example: "<p animate={{ style: PRESET.FADE_IN, when: WHEN.ATTACH }}>Hello</p>",
		summary: "The animate attribute plays when a node attaches or detaches. The node stays in the DOM until its leave ends.",
		bullets: [
			"WHEN.ATTACH plays when the element is placed on the page.",
			"WHEN.DETACH plays before the element is removed.",
		],
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
		id: scrollAtPageId,
		name: "Start and end",
		kind: "markup",
		group: "motion",
		signature: "more: { start: [EDGE.TOP, EDGE.BOTTOM], end: [EDGE.BOTTOM, EDGE.TOP] }",
		summary: "Set where a scroll animation starts and ends, as points on the element and on the screen.",
		bullets: [
			"start and end are pairs: [element edge, screen edge]. The first point is on the element, the second on the screen.",
			"Each point is EDGE.TOP (0), EDGE.CENTER (0.5), EDGE.BOTTOM (1), or a number from 0 to 1.",
			"Default: start [EDGE.TOP, EDGE.BOTTOM], end [EDGE.BOTTOM, EDGE.TOP].",
		],
		example: `<p animate={{ style: PRESET.FADE_IN, when: WHEN.SCROLL, more: { start: [EDGE.TOP, EDGE.CENTER], end: [EDGE.BOTTOM, EDGE.TOP] } }}>Hello</p>`,
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

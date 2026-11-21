import { highlightInto } from "./highlight/highlight.ts";

// The code shown on the Home feature cards. The test compiles each one, so the cards never show broken code.
export const featureSnippets = {
	variables: `<script>
import { variable } from "lusiajs";

const count = variable(0);
const double = variable.compute(() => count.value * 2);
</script>

<button onclick={() => count.value++}>
  Count {count}, double {double}
</button>`,
	flow: `<script>
import { variable } from "lusiajs";

const loggedIn = variable(false);
const todos = variable([{ id: 1, title: "Write docs" }]);
</script>

<IF {loggedIn}>
  <p>Welcome back.</p>
</IF>
<ELSE>
  <button onclick={() => (loggedIn.value = true)}>Log in</button>
</ELSE>

<ul>
  <EACH {todos} as={todo} index={i} key={todo.id}>
    <li>{i.value + 1}. {todo.title}</li>
  </EACH>
</ul>`,
	animate: `<script>
import { PRESET, WHEN } from "lusiajs";
</script>

<h2 animate={PRESET.FADE_IN}>Hello</h2>
<button animate={{ style: PRESET.ZOOM_IN, when: WHEN.HOVER }}>
  Hover me
</button>`,
	singleFile: `<script>
import { variable } from "lusiajs";

const name = variable("Ada");
</script>

<p>Hi {name}</p>

<style scoped>
p {
  color: tomato;
}
</style>`,
	propsCard: `<script>
import { props } from "lusiajs";

const { title } = props({ title: "" });
</script>

<section>
  <h2>{title}</h2>
  <CONTENT />
</section>`,
	propsUse: `<script>
import Card from "./Card.lusia";
</script>

<Card title="Inbox">
  <p>3 new messages</p>
</Card>`,
	scoped: `<div class="card">
  <p>Styled here only.</p>
</div>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 12px;
  background: #ffe4f1;
}
</style>`,
};

// Snippets in the Home features are highlighted once the page is attached. Motion is handled by animate.
export function initFeatures(root: ParentNode): void {
	for (const code of root.querySelectorAll<HTMLElement>("code[data-lang]")) {
		highlightInto(
			code,
			code.textContent ?? "",
			code.dataset.lang ?? "none",
		);
	}
}

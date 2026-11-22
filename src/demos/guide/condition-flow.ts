export const code = `<script>
  import { variable } from "lusiajs";

  const loggedIn = variable(false);
</script>

<IF {loggedIn}>
  <p>Welcome back.</p>
<ELSE>
  <button onclick={() => (loggedIn.value = true)}>Log in</button>
</IF>`;

const loginButton = [{ id: "login", tag: "button", text: "Log in" }];
const welcome = [{ id: "welcome", tag: "p", text: "Welcome back." }];

export const steps = [
  {
    title: "loggedIn is false, so the ELSE branch shows",
    lines: [4, 9, 10],
    nodes: loginButton,
  },
  {
    title: "A click sets loggedIn to true",
    lines: [10],
    nodes: loginButton,
  },
  {
    title: "The IF branch now shows, and the ELSE branch leaves",
    lines: [7, 8],
    nodes: welcome,
  },
];

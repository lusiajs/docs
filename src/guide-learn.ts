// One line per Guide section: what the reader will be able to do after it.
const learnLines: Record<string, string> = {
  "lusia-intro": "What a .lusia file holds, and how a variable updates the page.",
  "start-project": "How to make a new app and add Lusia to an existing one.",
  script: "Where the TypeScript of a component goes.",
  expr: "How to put a value into text and into an attribute.",
  variable: "How to make a value that updates the page when it changes.",
  "variable-compute": "How to make a value that is worked out from other variables.",
  "variable-auto-run": "How to run code again when the variables it reads change.",
  event: "How to run a function when the user clicks or types.",
  "bind-value": "How to keep an input and a variable in step.",
  if: "How to show markup only when a condition is true.",
  each: "How to repeat markup for each item of a list.",
  for: "How to repeat markup a set number of times.",
  "component-tag": "How to import a component file and place it in markup.",
  props: "How to pass values into a component.",
  content: "How to let a parent put markup inside a component.",
  lifecycle: "When a component is placed, removed, and how to run code at each step.",
  attach: "How to place a component on the page by code.",
  detach: "How to remove a placed component, and wait for its animation.",
  "on-attach": "How to run setup code when a component is placed.",
  "on-detach": "How to run cleanup code when a component is removed.",
  style: "How the style of a component is kept to that component.",
  "style-scoped": "How a scoped style applies only to its own component.",
  "style-global": "How to write a style that applies to the whole page.",
  animate: "How to animate an element when it appears, leaves or is changed.",
  when: "How to choose the moment an animation plays.",
  preset: "How to use a ready-made animation.",
  ease: "How to change the speed curve of an animation.",
  config: "How to set animation defaults for the whole project.",
  "animate-space-page": "How to slide neighbors when an element attaches or detaches.",
};

// The learn line of a Guide section, or null when the section has none.
export function learnOf(id: string): string | null {
  return learnLines[id] ?? null;
}

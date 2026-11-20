[Back to README](../README.md)

# Events and bind

Run code when something happens, and keep form fields in sync with variables.

| Attribute              | Use it for                              |
| ---------------------- | --------------------------------------- |
| `onclick={fn}`         | Running a function on an event          |
| `bind={variable}`         | Two-way link for a form field           |
| `bind-<prop>={variable}`  | Two-way link for any DOM property       |
| `bind-element={variable}` | Getting the element itself into a variable |

## Events

Any attribute named `on` plus an event name runs a function on that event.

```html
<script>
  import { variable } from "lucia";

  const count = variable(0);

  function increment() {
    count.value++;
  }
</script>

<button onclick="{increment}">Clicked {count} times</button>
```

| Rule             | Detail                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Name             | `on` plus the event name: `onclick`, `oninput`, `onkeydown`, `onsubmit`                        |
| Value            | One `{expression}`. A function name or an arrow function, such as `onclick={() => remove(id)}` |
| The event        | The function gets the DOM event as its argument                                                |
| When read        | Once, when the component is placed. The handler is not reactive                                |
| Removal          | The listener is removed when the component is detached                                         |
| Plain HTML       | `onclick="..."` with quotes and no `{}` stays a normal attribute                               |
| Child components | `onclick` is a prop. The child reads it with `props()`                                         |

> [!TIP]
> Use a named function for anything longer than one line. It reads better in the script and in the markup.

## bind

`bind={variable}` links a form field and a variable in both directions. Typing updates the variable, and changing the variable updates the field.

```html
<script>
  import { variable } from "lucia";

  const name = variable("");
</script>

<input bind="{name}" />
<p>Hello {name}</p>
```

The field decides which property is linked and which event reports changes.

| Element                            | Linked property          | Event    |
| ---------------------------------- | ------------------------ | -------- |
| `<input type="text">`, `textarea`  | `value`                  | `input`  |
| `<input type="number">`, `range`   | number (`valueAsNumber`) | `input`  |
| `<input type="checkbox">`, `radio` | `checked`                | `change` |
| `<select>`                         | `value`                  | `change` |

A number field writes `null` when it is empty.

## bind-<prop>

`bind-<prop>` links any DOM property. Write the property name in kebab-case. It becomes camelCase in the code.

```html
<script>
  import { variable } from "lucia";

  const name = variable("Ada");
</script>

<input type="text" bind-value="{name}" />
```

| Attribute      | Property                       |
| -------------- | ------------------------------ |
| `bind-value`   | `value`                        |
| `bind-checked` | `checked`                      |
| `bind-open`    | `open` (see the warning below) |

> [!WARNING]
> `bind-<prop>` listens to `input` and `change` only. A property that changes on other events does not write back to the variable.

## bind-element

`bind-element={variable}` puts the element into a variable. Use it instead of `querySelector`.

```html
<script>
  import { variable } from "lucia";

  const field = (variable < HTMLInputElement) | (null > null);

  function focusField() {
    field.value?.focus();
  }
</script>

<input bind-element="{field}" />
<button onclick="{focusField}">Focus</button>
```

| Moment   | Variable value                                  |
| -------- | -------------------------------------------- |
| Placed   | The element. It is set before `setup()` runs |
| Detached | `null`                                       |

## Rules for bind

| Rule           | Detail                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Writable variable | The variable must come from `variable()`. A `variable.compute()` value, or a plain value, is refused at run time |
| Where          | `bind` works on `input`, `textarea` and `select`. Use `bind-<prop>` on other elements                |
| Components     | `bind` is not allowed on a component tag                                                             |
| Loops          | A value that is already equal is not written again, so the two sides do not loop                     |

## Errors

| Mistake                       | Message                                                                    |
| ----------------------------- | -------------------------------------------------------------------------- |
| `bind` with no `{variable}`      | `bind needs {variable}`                                                       |
| `bind-` with no property name | `bind-<property> needs a property name, like bind-value`                   |
| `bind` on a plain element     | `bind works on input, textarea and select; use bind-<property>`            |
| `bind` on a component         | `bind works on elements only`                                              |
| A read-only or plain value    | `bind-value needs a writable variable` (the attribute name is in the message) |
| Event with text mixed in      | `onclick needs one {handler}`                                              |

Compile errors show the file, line and column. Run-time errors name the attribute.

## More

| Topic                             | Page                        |
| --------------------------------- | --------------------------- |
| Components                        | [Components](components.md) |
| Blocks: `<IF>`, `<EACH>`, `<FOR>` | [Flow](flow.md)             |

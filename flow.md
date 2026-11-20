[Back to README](../README.md)

# Flow: IF, EACH and FOR

Flow tags show, repeat or skip parts of the markup. Their names are uppercase so they stand out from HTML.

| Tag                          | Use it for                                |
| ---------------------------- | ----------------------------------------- |
| `<IF>`, `<ELSEIF>`, `<ELSE>` | Showing one part when a condition is true |
| `<EACH>`                     | Repeating a part for each item in a list  |
| `<FOR>`                      | Repeating a part for a range of numbers   |

## IF

```html
<script>
  import { variable } from "lucia";

  const loggedIn = variable(false);

  function logIn() {
    loggedIn.value = true;
  }
</script>

<IF {loggedIn}>
  <p>Welcome back.</p>
</IF>
<ELSE>
  <button onclick="{logIn}">Log in</button>
</ELSE>
```

### Branches

| Tag               | Condition | Rule                                                  |
| ----------------- | --------- | ----------------------------------------------------- |
| `<IF {cond}>`     | Required  | Starts the chain                                      |
| `<ELSEIF {cond}>` | Required  | Checked when the branches before it are false         |
| `<ELSE>`          | None      | Shown when no branch above it is true. Ends the chain |

- Only the first true branch shows.
- `ELSEIF` and `ELSE` must come right after `</IF>` or `</ELSEIF>`.
- A condition is read again when its variables update.
- Use `.value` in a comparison: `{score.value >= 90}`. A bare variable is an object, so `{score >= 90}` does not compare the number.

```html
<script>
  import { variable } from "lucia";

  const score = variable(72);
</script>

<IF {score.value
  >= 90}>
  <p>A</p>
</IF>
<ELSEIF {score.value
  >= 70}>
  <p>C</p>
</ELSEIF>
<ELSE>
  <p>Try again</p>
</ELSE>
```

> [!NOTE]
> When the branch changes, the new one appears at once. The old one plays its `OUT` animations first, then it is removed.

## EACH

`<EACH>` repeats its content once for each item.

```html
<script>
  import { variable } from "lucia";

  const todos = variable([
    { id: 1, title: "Write docs" },
    { id: 2, title: "Ship" },
  ]);

  function remove(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  }
</script>

<ul>
  <EACH {todos} as="{todo}" index="{i}" key="{todo.id}">
    <li>{i.value + 1}. {todo.title} <button onclick="{()" ="">remove(todo.id)}>Remove</button></li>
  </EACH>
</ul>
```

| Attribute      | Required                        | Effect                                        |
| -------------- | ------------------------------- | --------------------------------------------- |
| `{list}`       | Yes                             | The list. An array, or a variable that holds one |
| `as={name}`    | No, but needed to read the item | Names the item for the markup                 |
| `index={name}` | No                              | Names the position. It is a variable             |
| `key={expr}`   | No                              | Gives each row its identity                   |

### Index

`index` is a variable, so `{i}` shows the number. Math needs `.value`:

| Write           | Result               |
| --------------- | -------------------- |
| `{i}`           | The position, from 0 |
| `{i.value + 1}` | The position, from 1 |

### Keys

| Case                  | What happens                                                                            |
| --------------------- | --------------------------------------------------------------------------------------- |
| No `key`              | The item itself is the key. Works for primitives, not for new copies of objects         |
| `key={item.id}`       | Rows with the same id keep their DOM when the list updates. They are moved, not rebuilt |
| Same key, new object  | The row is rebuilt, because its item changed                                            |
| Two rows with one key | Error: `EACH keys must be unique, but ... appears twice`                                |

> [!TIP]
> Give every row a `key` from the data, such as an id. It keeps the DOM and the animations of each row.

Inside `key={...}` the index is a plain number, not a variable.

### Changes

| Change          | What happens                                       |
| --------------- | -------------------------------------------------- |
| Item added      | A new row is created in its place                  |
| Item removed    | Its `OUT` animations play, then the row is removed |
| Items reordered | Rows with keys are moved                           |
| List replaced   | Rows are matched by key, as above                  |

## FOR

`<FOR>` repeats its content for a range of numbers.

```html
<script>
  import { variable } from "lucia";

  const rows = variable(3);
</script>

<FOR {i} from="{0}" to="{rows.value}">
  <p>Row {i + 1}</p>
</FOR>
```

| Attribute | Default  | Meaning                                           |
| --------- | -------- | ------------------------------------------------- |
| `{i}`     | Required | The name of the number. Plain, so `{i + 1}` works |
| `from`    | `0`      | The first value                                   |
| `to`      | Required | The end. It is **not** included                   |
| `step`    | `1`      | The gap. A negative step counts down              |

| Example                     | Values  |
| --------------------------- | ------- |
| `from={0} to={3}`           | 0, 1, 2 |
| `from={3} to={0} step={-1}` | 3, 2, 1 |
| `from={0} to={10} step={5}` | 0, 5    |

> [!WARNING]
> A `step` of `0` throws `FOR needs a step that is not 0`.

`from`, `to` and `step` are read again when their variables update, and the rows update.

## Nesting

Blocks can go inside other blocks, and inside components. Components and `animate` work inside blocks too.

```html
<EACH {groups} as="{group}" key="{group.name}">
  <h2>{group.name}</h2>
  <IF {group.open}>
    <FOR {n} to="{group.count}">
      <p>Item {n}</p>
    </FOR>
  </IF>
</EACH>
```

## Errors

| Mistake                                                       | Message                                          |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `<IF>` with no `{condition}`                                  | `IF needs {condition}`                           |
| `<ELSEIF>` with no `{condition}`                              | `ELSEIF needs {condition}`                       |
| `<ELSE>` or `<ELSEIF>` not right after `</IF>` or `</ELSEIF>` | `<ELSE> must directly follow </IF> or </ELSEIF>` |
| Attribute on `<IF>` or `<ELSE>`                               | `IF takes no attributes`                         |
| `<EACH>` with no `{list}`                                     | `EACH needs {list}`                              |
| `as=` or `index=` without a name                              | `as needs a name in {}, like as={item}`          |
| `<FOR>` with no `{name}`                                      | `FOR needs a name in {}, like {i}`               |
| `<FOR>` with no `to=`                                         | `FOR needs to={end}`                             |
| Closing tag does not match                                    | `expected </IF>, found </EACH>`                  |

Errors show the file, line and column.

## More

| Topic           | Page                         |
| --------------- | ---------------------------- |
| Events and bind | [Events and bind](events.md) |
| Components      | [Components](components.md)  |

[Back to README](../README.md)

# Error codes

An error code is a short name, such as `L1016`, that tells you which check failed. Each code has a fixed message and a hint on how to fix it.

| Range              | When it shows                                                                | Raised by    |
| ------------------ | ---------------------------------------------------------------------------- | ------------ |
| `L1001` to `L1034` | While the app builds, for a problem in a `.lucia` file                       | The compiler |
| `L2001` to `L2046` | While the app runs, for a value passed to `animate`, `bind`, `EACH` or `FOR` | The runtime  |

In messages, `<name>` stands for a value filled in when the error is raised, such as a tag or attribute name.

> [!NOTE]
> Dev builds add the file, line and column to runtime errors. Production builds do not, so those errors only have the message and hint.

## Printed output

A build error prints the location, a code frame and the hint:

```
src/Counter.lucia:6:1 - error L1001: unclosed <div>

4 | <p>Clicked {count}</p>
5 |
6 | <div class="box">
  | ^~~~~~~~~~~~~~~~~
7 |   <span>Hi</span>
8 |

hint: Add the closing tag, such as </div>, after the content.
```

## Index

| Code            | Message                                                                                           | Hint                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [L1001](#l1001) | `unclosed <tag>`                                                                                  | Add the closing tag, such as `</tag>`, after the content.                        |
| [L1002](#l1002) | `only one <script> is allowed`                                                                    | Move the code into one `<script>` section.                                       |
| [L1003](#l1003) | `a component's <script> cannot export`                                                            | Move shared values into a `.ts` file and import them.                            |
| [L1004](#l1004) | `<name>` is a reserved tag name and cannot be a component                                         | Rename the component. `IF`, `ELSEIF`, `ELSE`, `EACH` and `FOR` are built in.     |
| [L1005](#l1005) | `<message>`                                                                                       | Check the Sass syntax in this `<style>` section.                                 |
| [L1006](#l1006) | `unclosed <!-- comment`                                                                           | Add `-->` to close the comment.                                                  |
| [L1007](#l1007) | `unclosed <name>`                                                                                 | Add `>` to close the tag, or `/>` if it has no content.                          |
| [L1008](#l1008) | `unclosed closing tag`                                                                            | Add `>` after the closing tag name.                                              |
| [L1009](#l1009) | `<name>` cannot have child content yet                                                            | Write `<name />` with nothing between the tags.                                  |
| [L1010](#l1010) | `unclosed {`                                                                                      | Add `}` to close the expression.                                                 |
| [L1011](#l1011) | `empty {}`                                                                                        | Put an expression between the braces, such as `{count}`.                         |
| [L1012](#l1012) | `expected an attribute name`                                                                      | Remove the stray character, or add a name.                                       |
| [L1013](#l1013) | `unclosed attribute value`                                                                        | Add the closing quote after the value.                                           |
| [L1014](#l1014) | `bind-<property>` needs a property name                                                           | Write the property after the dash, such as `bind-value`.                         |
| [L1015](#l1015) | `<attr>` needs `{store}`                                                                          | Put a store in braces, such as `<attr>={name}`.                                  |
| [L1016](#l1016) | `<attr>` needs one `{handler}`                                                                    | Put one function in braces, such as `onclick={increment}`.                       |
| [L1017](#l1017) | an element can have only one `animate`                                                            | Put several animations in one array inside `animate`.                            |
| [L1018](#l1018) | `animate` needs `{keyframes}`                                                                     | Put the keyframes in braces, such as `animate={fadeIn}`.                         |
| [L1019](#l1019) | `<tag>` takes no attributes                                                                       | Remove the attributes from `<tag>`.                                              |
| [L1020](#l1020) | `<tag>` has no `<attr>` attribute                                                                 | Check the spelling. Only the attributes listed in the docs are allowed.          |
| [L1021](#l1021) | `<attr>` is given twice                                                                           | Keep one `<attr>` attribute.                                                     |
| [L1022](#l1022) | `<attr>` needs `{expression}`                                                                     | Put a value in braces, such as `<attr>={value}`.                                 |
| [L1023](#l1023) | `bind` works on elements only                                                                     | Pass the store as a prop, such as `value={name}`, and bind inside the component. |
| [L1024](#l1024) | `bind` works on input, textarea and select                                                        | Use `bind-value`, `bind-checked` and so on for other elements.                   |
| [L1025](#l1025) | `<attr>` needs a name in `{}`, like `<attr>={item}`                                               | Use one plain name, with no dots or symbols.                                     |
| [L1026](#l1026) | `<name>` needs a closing `</name>`                                                                | Write `<name> ... </name>` instead of `<name />`.                                |
| [L1027](#l1027) | expected `</name>`                                                                                | Close the block with `</name>` after its content.                                |
| [L1028](#l1028) | expected `</name>`, found `</found>`                                                              | Close the block with `</name>` before the other closing tag.                     |
| [L1029](#l1029) | `<name>` needs `{condition}`                                                                      | Put the condition in braces first, such as `<IF {loggedIn}>`.                    |
| [L1030](#l1030) | `EACH` needs `{list}`                                                                             | Put the list in braces first, such as `<EACH {items} as={item}>`.                |
| [L1031](#l1031) | `FOR` needs a name in `{}`, like `{i}`                                                            | Put the loop name in braces first, such as `<FOR {i} to={10}>`.                  |
| [L1032](#l1032) | `FOR` needs `to={end}`                                                                            | Add the end value, such as `to={10}`.                                            |
| [L1033](#l1033) | unexpected `</tag>`                                                                               | Remove it, or open the block it closes.                                          |
| [L1034](#l1034) | `<tag>` must directly follow `</IF>` or `</ELSEIF>`                                               | Put `ELSEIF` or `ELSE` right after the branch before it.                         |
| [L2001](#l2001) | animate item needs a style                                                                        | Add `style` to the item, such as `{ style: fadeIn }`.                            |
| [L2002](#l2002) | animate `when` must be `WHEN.ATTACH`, `DETACH`, `VIEW`, `HOVER`, `SCROLL` or `MANUAL`, or a store | Pass one of the `WHEN` values, or a store.                                       |
| [L2003](#l2003) | animate `<name>` must be a time in ms                                                             | Use a number of milliseconds, such as `300`.                                     |
| [L2004](#l2004) | animate `loop` must be `true` or a count                                                          | Use `true`, or a number of times such as `3`.                                    |
| [L2005](#l2005) | ease moved into the keyframes: `default: [...]`                                                   | Write `default: [EASE.STYLE.QUART, EASE.INOUT]` inside the keyframes.            |
| [L2006](#l2006) | curve/transition moved into the keyframes: `default: [EASE.STYLE.X, EASE.Y]`                      | Write `default: [EASE.STYLE.X, EASE.Y]` inside the keyframes.                    |
| [L2007](#l2007) | `alternate` was renamed to `backAndForth`                                                         | Write `backAndForth: true` instead.                                              |
| [L2008](#l2008) | `reverse` moved into `more: { reverse: true }`                                                    | Write `more: { reverse: true }` instead.                                         |
| [L2009](#l2009) | `loop` does not work with `WHEN.SCROLL`                                                           | Remove `loop`, or use another `WHEN` value.                                      |
| [L2010](#l2010) | `more` is not used with `<when>`                                                                  | Remove `more`, or use an `WHEN` value that takes it.                             |
| [L2011](#l2011) | animate `more` must be an object with `<keys>`                                                    | Pass an object with the keys listed.                                             |
| [L2012](#l2012) | `more` has an unknown key `"<key>"`, use `<keys>`                                                 | Check the spelling of the key.                                                   |
| [L2013](#l2013) | animate `more` `outDuration` needs `out`                                                          | Add `out` with the keyframes for leaving, or remove `outDuration`.               |
| [L2014](#l2014) | animate `more` `out` must be keyframes                                                            | Give `out` an object of keyframes.                                               |
| [L2015](#l2015) | animate `more` `start` and `end` cannot be used with `follow`                                     | Remove `start` and `end`. `follow` sets the progress.                            |
| [L2016](#l2016) | animate `more` `follow` must be a store that holds an element                                     | Use a store that `bind-element` writes to.                                       |
| [L2017](#l2017) | animate `more` `start` and `end` must be numbers                                                  | Use numbers, such as `start: 1` and `end: 0.2`.                                  |
| [L2018](#l2018) | animate `more` `start` and `end` must be different lines                                          | Use two different numbers for `start` and `end`.                                 |
| [L2019](#l2019) | animate `more` `part` must be `[from, to]` with `0 <= from < to <= 1`                             | Use a pair such as `[0, 0.5]`.                                                   |
| [L2020](#l2020) | animate `more` `reverse` must be `true` or `false`                                                | Use `true` or `false`.                                                           |
| [L2021](#l2021) | animate `more` `margin` must be a number of px or a CSS length                                    | Use a number of px, such as `40`, or a string such as `"10%"`.                   |
| [L2022](#l2022) | animate `more` `amount` must be a number from 0 to 1                                              | Use a number from 0 to 1, such as `0.5`.                                         |
| [L2023](#l2023) | animate `midway` must be a `MIDWAY` member or an object                                           | Use a `MIDWAY` member, or an object with `play`.                                 |
| [L2024](#l2024) | `midway` has an unknown key `"<key>"`                                                             | Check the spelling of the key.                                                   |
| [L2025](#l2025) | animate `midway.play` must be a `MIDWAY` member                                                   | Use a member of `MIDWAY`, such as `MIDWAY.FINISH`.                               |
| [L2026](#l2026) | animate `midway.turn` must be a `TURN` member, or a function                                      | Use a member of `TURN`, such as `TURN.SMOOTH`, or a function.                    |
| [L2027](#l2027) | animate `midway.turnDuration` must be a time in ms                                                | Use a number of milliseconds, such as `200`.                                     |
| [L2028](#l2028) | animate `midway.turnStyle` must be an `EASE.STYLE` member                                         | Use a member of `EASE.STYLE`, such as `EASE.STYLE.CUBIC`.                        |
| [L2029](#l2029) | animate `midway.turnEase` must be an `EASE` member                                                | Use a member of `EASE`, such as `EASE.INOUT`.                                    |
| [L2030](#l2030) | `setAnimateDefault` has an unknown key `"<key>"`                                                  | Check the spelling of the key.                                                   |
| [L2031](#l2031) | `setAnimateDefault` `duration` must be a time in ms                                               | Use a number of milliseconds, such as `300`.                                     |
| [L2032](#l2032) | animate `default` must be one of the three listed forms                                           | Use one of the three listed forms.                                               |
| [L2033](#l2033) | animate key must be a style object or one of the listed forms                                     | Use a style object, or one of the listed forms with it.                          |
| [L2034](#l2034) | animate easing style must be a function of t                                                      | Use a member of `EASE.STYLE`, such as `EASE.STYLE.QUART`.                        |
| [L2035](#l2035) | animate ease must be `EASE.IN`, `EASE.OUT` or `EASE.INOUT`                                        | Use a member of `EASE`, such as `EASE.INOUT`.                                    |
| [L2036](#l2036) | animate keyframe `<at>` is outside 0..1                                                           | Keyframe keys are fractions of the animation, from 0 to 1.                       |
| [L2037](#l2037) | animate keyframe `<at>` is listed twice                                                           | Keep one entry for each key.                                                     |
| [L2038](#l2038) | animate keyframes must include the keys 0 and 1                                                   | Add a key `0` for the start and a key `1` for the end.                           |
| [L2039](#l2039) | animate list changed length after it was attached                                                 | Keep the number of animate items fixed. Only their values can change.            |
| [L2040](#l2040) | `props()` can only be called in a component's `<script>`                                          | Call `props()` at the top level of a `.lucia` `<script>`.                        |
| [L2041](#l2041) | `EACH` keys must be unique, but `<key>` appears twice                                             | Give each row a key that no other row has.                                       |
| [L2042](#l2042) | `FOR` needs a step that is not 0                                                                  | Use a step such as `1`, or `-1` to count down.                                   |
| [L2043](#l2043) | `<attr>` needs a writable store                                                                   | Bind to a store made with `store()`, not to a computed value.                    |
| [L2044](#l2044) | `ACTIVE.IN` and `ACTIVE.OUT` were renamed to `ACTIVE.ATTACH` and `ACTIVE.DETACH`                  | Replace `IN` with `ATTACH` and `OUT` with `DETACH`.                              |
| [L2045](#l2045) | animation was renamed to style                                                                    | Write `style: keyframes` instead of `animation: keyframes`.                      |
| [L2046](#l2046) | active was renamed to when                                                                        | Write `when:` instead of `active:`.                                              |

## L1001

|         |                                                           |
| ------- | --------------------------------------------------------- |
| Message | unclosed `<tag>`                                          |
| Hint    | Add the closing tag, such as `</tag>`, after the content. |

Bad:

```html
<div class="box">
  <span>Hi</span>
</div>
```

Fixed:

```html
<div class="box">
  <span>Hi</span>
</div>
```

## L1002

|         |                                            |
| ------- | ------------------------------------------ |
| Message | only one `<script>` is allowed             |
| Hint    | Move the code into one `<script>` section. |

Bad:

```html
<script>
  const a = 1;
</script>
<script>
  const b = 2;
</script>
```

Fixed:

```html
<script>
  const a = 1;
  const b = 2;
</script>
```

## L1003

|         |                                                       |
| ------- | ----------------------------------------------------- |
| Message | a component's `<script>` cannot export                |
| Hint    | Move shared values into a `.ts` file and import them. |

Bad:

```html
<script>
  export const max = 10;
</script>
```

Fixed (in `config.ts`, `export const max = 10;`, then in the component):

```html
<script>
  import { max } from "./config.ts";
</script>
```

## L1004

|         |                                                                              |
| ------- | ---------------------------------------------------------------------------- |
| Message | `<name>` is a reserved tag name and cannot be a component                    |
| Hint    | Rename the component. `IF`, `ELSEIF`, `ELSE`, `EACH` and `FOR` are built in. |

Bad:

```html
<script>
  import EACH from "./list.lucia";
</script>
```

Fixed:

```html
<script>
  import TodoList from "./list.lucia";
</script>
```

## L1005

|         |                                                  |
| ------- | ------------------------------------------------ |
| Message | `<message>` (the Sass compiler's message)        |
| Hint    | Check the Sass syntax in this `<style>` section. |

Bad:

```html
<style>
  .box { color: red;
</style>
```

Fixed:

```html
<style>
  .box {
    color: red;
  }
</style>
```

## L1006

|         |                                 |
| ------- | ------------------------------- |
| Message | unclosed `<!-- comment`         |
| Hint    | Add `-->` to close the comment. |

Bad:

```html
<!-- Shows the total
<p>{total}</p>
```

Fixed:

```html
<!-- Shows the total -->
<p>{total}</p>
```

## L1007

|         |                                                         |
| ------- | ------------------------------------------------------- |
| Message | unclosed `<name>`                                       |
| Hint    | Add `>` to close the tag, or `/>` if it has no content. |

Bad:

```html
<img src="logo.png"
```

Fixed:

```html
<img src="logo.png" />
```

## L1008

|         |                                     |
| ------- | ----------------------------------- |
| Message | unclosed closing tag                |
| Hint    | Add `>` after the closing tag name. |

Bad:

```html
<p>Hi</p
```

Fixed:

```html
<p>Hi</p>
```

## L1009

|         |                                                 |
| ------- | ----------------------------------------------- |
| Message | `<name>` cannot have child content yet          |
| Hint    | Write `<name />` with nothing between the tags. |

Bad:

```html
<Badge>New</Badge>
```

Fixed:

```html
<Badge />
```

## L1010

|         |                                  |
| ------- | -------------------------------- |
| Message | unclosed `{`                     |
| Hint    | Add `}` to close the expression. |

Bad:

```html
<p>{count</p>
```

Fixed:

```html
<p>{count}</p>
```

## L1011

|         |                                                          |
| ------- | -------------------------------------------------------- |
| Message | empty `{}`                                               |
| Hint    | Put an expression between the braces, such as `{count}`. |

Bad:

```html
<p>{}</p>
```

Fixed:

```html
<p>{count}</p>
```

## L1012

|         |                                            |
| ------- | ------------------------------------------ |
| Message | expected an attribute name                 |
| Hint    | Remove the stray character, or add a name. |

Bad:

```html
<button "primary">Save</button>
```

Fixed:

```html
<button class="primary">Save</button>
```

## L1013

|         |                                        |
| ------- | -------------------------------------- |
| Message | unclosed attribute value               |
| Hint    | Add the closing quote after the value. |

Bad:

```html
<a href="/home>Home</a>
```

Fixed:

```html
<a href="/home">Home</a>
```

## L1014

|         |                                                          |
| ------- | -------------------------------------------------------- |
| Message | `bind-<property>` needs a property name                  |
| Hint    | Write the property after the dash, such as `bind-value`. |

Bad:

```html
<input bind-="{name}" />
```

Fixed:

```html
<input bind-value="{name}" />
```

## L1015

|         |                                                 |
| ------- | ----------------------------------------------- |
| Message | `<attr>` needs `{store}`                        |
| Hint    | Put a store in braces, such as `<attr>={name}`. |

Bad:

```html
<input bind="name" />
```

Fixed:

```html
<input bind="{name}" />
```

## L1016

|         |                                                            |
| ------- | ---------------------------------------------------------- |
| Message | `<attr>` needs one `{handler}`                             |
| Hint    | Put one function in braces, such as `onclick={increment}`. |

Bad:

```html
<button onclick="{increment}{reset}">Count</button>
```

Fixed:

```html
<button onclick="{increment}">Count</button>
```

## L1017

|         |                                                       |
| ------- | ----------------------------------------------------- |
| Message | an element can have only one `animate`                |
| Hint    | Put several animations in one array inside `animate`. |

Bad:

```html
<div animate="{fadeIn}" animate="{glow}">Hi</div>
```

Fixed:

```html
<div animate={[{ style: fadeIn }, { style: glow, when: WHEN.HOVER }]}>Hi</div>
```

## L1018

|         |                                                          |
| ------- | -------------------------------------------------------- |
| Message | `animate` needs `{keyframes}`                            |
| Hint    | Put the keyframes in braces, such as `animate={fadeIn}`. |

Bad:

```html
<div animate="fadeIn">Hi</div>
```

Fixed:

```html
<div animate="{fadeIn}">Hi</div>
```

## L1019

|         |                                     |
| ------- | ----------------------------------- |
| Message | `<tag>` takes no attributes         |
| Hint    | Remove the attributes from `<tag>`. |

Bad:

```html
<ELSE class="x">...</ELSE>
```

Fixed:

```html
<ELSE>...</ELSE>
```

## L1020

|         |                                                                         |
| ------- | ----------------------------------------------------------------------- |
| Message | `<tag>` has no `<attr>` attribute                                       |
| Hint    | Check the spelling. Only the attributes listed in the docs are allowed. |

Bad:

```html
<EACH {items} as="{item}" idx="{i}">...</EACH>
```

Fixed:

```html
<EACH {items} as="{item}" index="{i}">...</EACH>
```

## L1021

|         |                              |
| ------- | ---------------------------- |
| Message | `<attr>` is given twice      |
| Hint    | Keep one `<attr>` attribute. |

Bad:

```html
<button onclick="{save}" onclick="{reset}">Save</button>
```

Fixed:

```html
<button onclick="{save}">Save</button>
```

## L1022

|         |                                                  |
| ------- | ------------------------------------------------ |
| Message | `<attr>` needs `{expression}`                    |
| Hint    | Put a value in braces, such as `<attr>={value}`. |

Bad:

```html
<EACH {items} as="item">...</EACH>
```

Fixed:

```html
<EACH {items} as="{item}">...</EACH>
```

## L1023

|         |                                                                                  |
| ------- | -------------------------------------------------------------------------------- |
| Message | `bind` works on elements only                                                    |
| Hint    | Pass the store as a prop, such as `value={name}`, and bind inside the component. |

Bad:

```html
<Field bind="{name}" />
```

Fixed:

```html
<Field value="{name}" />
```

## L1024

|         |                                                                |
| ------- | -------------------------------------------------------------- |
| Message | `bind` works on input, textarea and select                     |
| Hint    | Use `bind-value`, `bind-checked` and so on for other elements. |

Bad:

```html
<div bind="{name}">...</div>
```

Fixed:

```html
<input bind="{name}" />
```

## L1025

|         |                                                     |
| ------- | --------------------------------------------------- |
| Message | `<attr>` needs a name in `{}`, like `<attr>={item}` |
| Hint    | Use one plain name, with no dots or symbols.        |

Bad:

```html
<EACH {items} as="{item.name}">...</EACH>
```

Fixed:

```html
<EACH {items} as="{item}">...</EACH>
```

## L1026

|         |                                                   |
| ------- | ------------------------------------------------- |
| Message | `<name>` needs a closing `</name>`                |
| Hint    | Write `<name> ... </name>` instead of `<name />`. |

Bad:

```html
<IF {ok} />
```

Fixed:

```html
<IF {ok}>...</IF>
```

## L1027

|         |                                                   |
| ------- | ------------------------------------------------- |
| Message | expected `</name>`                                |
| Hint    | Close the block with `</name>` after its content. |

Bad:

```html
<EACH {items} as="{item}"> <li>{item}</li></EACH>
```

Fixed:

```html
<EACH {items} as="{item}">
  <li>{item}</li>
</EACH>
```

## L1028

|         |                                                              |
| ------- | ------------------------------------------------------------ |
| Message | expected `</name>`, found `</found>`                         |
| Hint    | Close the block with `</name>` before the other closing tag. |

Bad:

```html
<IF {ok}>
  <p>Hi</p>
</EACH>
```

Fixed:

```html
<IF {ok}>
  <p>Hi</p>
</IF>
```

## L1029

|         |                                                               |
| ------- | ------------------------------------------------------------- |
| Message | `<name>` needs `{condition}`                                  |
| Hint    | Put the condition in braces first, such as `<IF {loggedIn}>`. |

Bad:

```html
<IF>...</IF>
```

Fixed:

```html
<IF {loggedIn}>...</IF>
```

## L1030

|         |                                                                   |
| ------- | ----------------------------------------------------------------- |
| Message | `EACH` needs `{list}`                                             |
| Hint    | Put the list in braces first, such as `<EACH {items} as={item}>`. |

Bad:

```html
<EACH as="{item}">...</EACH>
```

Fixed:

```html
<EACH {items} as="{item}">...</EACH>
```

## L1031

|         |                                                                 |
| ------- | --------------------------------------------------------------- |
| Message | `FOR` needs a name in `{}`, like `{i}`                          |
| Hint    | Put the loop name in braces first, such as `<FOR {i} to={10}>`. |

Bad:

```html
<FOR to="{10}">...</FOR>
```

Fixed:

```html
<FOR {i} to="{10}">...</FOR>
```

## L1032

|         |                                       |
| ------- | ------------------------------------- |
| Message | `FOR` needs `to={end}`                |
| Hint    | Add the end value, such as `to={10}`. |

Bad:

```html
<FOR {i} from="{0}">...</FOR>
```

Fixed:

```html
<FOR {i} from="{0}" to="{10}">...</FOR>
```

## L1033

|         |                                         |
| ------- | --------------------------------------- |
| Message | unexpected `</tag>`                     |
| Hint    | Remove it, or open the block it closes. |

Bad:

```html
<p>Hi</p></IF>
```

Fixed:

```html
<p>Hi</p>
```

## L1034

|         |                                                          |
| ------- | -------------------------------------------------------- |
| Message | `<tag>` must directly follow `</IF>` or `</ELSEIF>`      |
| Hint    | Put `ELSEIF` or `ELSE` right after the branch before it. |

Bad:

```html
<IF {ok}>...</IF>
<p>Other</p>
<ELSE>...</ELSE>
```

Fixed:

```html
<IF {ok}>...</IF>
<ELSE>...</ELSE>
<p>Other</p>
```

## L2001

|         |                                                       |
| ------- | ----------------------------------------------------- |
| Message | animate item needs a style                            |
| Hint    | Add `style` to the item, such as `{ style: fadeIn }`. |

Bad:

```html
<div animate={{ when: WHEN.VIEW }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp, when: WHEN.VIEW }}>...</div>
```

## L2002

|         |                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------- |
| Message | animate `when` must be `WHEN.ATTACH`, `DETACH`, `VIEW`, `HOVER`, `SCROLL` or `MANUAL`, or a store |
| Hint    | Pass one of the `WHEN` values, or a store.                                                        |

Bad:

```html
<div animate={{ style: fadeUp, when: "view" }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp, when: WHEN.VIEW }}>...</div>
```

## L2003

|         |                                                      |
| ------- | ---------------------------------------------------- |
| Message | animate `<name>` must be a time in ms, got `<value>` |
| Hint    | Use a number of milliseconds, such as `300`.         |

Bad:

```html
<div animate={{ style: fadeUp, duration: "fast" }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp, duration: 300 }}>...</div>
```

## L2004

|         |                                                         |
| ------- | ------------------------------------------------------- |
| Message | animate `loop` must be `true` or a count, got `<value>` |
| Hint    | Use `true`, or a number of times such as `3`.           |

Bad:

```html
<div animate={{ style: pulse, loop: "forever" }}>...</div>
```

Fixed:

```html
<div animate={{ style: pulse, loop: true }}>...</div>
```

## L2005

|         |                                                                       |
| ------- | --------------------------------------------------------------------- |
| Message | ease moved into the keyframes: `default: [...]`                       |
| Hint    | Write `default: [EASE.STYLE.QUART, EASE.INOUT]` inside the keyframes. |

Bad:

```html
<div animate={{ style: fadeUp, ease: EASE.OUT }}>...</div>
```

Fixed (inside the keyframes object):

```ts
const fadeUp = { default: [EASE.STYLE.QUART, EASE.OUT], 0: { opacity: 0 }, 1: { opacity: 1 } };
```

## L2006

|         |                                                                              |
| ------- | ---------------------------------------------------------------------------- |
| Message | curve/transition moved into the keyframes: `default: [EASE.STYLE.X, EASE.Y]` |
| Hint    | Write `default: [EASE.STYLE.X, EASE.Y]` inside the keyframes.                |

Bad:

```html
<div animate={{ style: fadeUp, curve: EASE.STYLE.CUBIC }}>...</div>
```

Fixed (inside the keyframes object):

```ts
const fadeUp = { default: [EASE.STYLE.CUBIC, EASE.OUT], 0: { opacity: 0 }, 1: { opacity: 1 } };
```

## L2007

|         |                                           |
| ------- | ----------------------------------------- |
| Message | `alternate` was renamed to `backAndForth` |
| Hint    | Write `backAndForth: true` instead.       |

Bad:

```html
<div animate={{ style: pulse, loop: true, alternate: true }}>...</div>
```

Fixed:

```html
<div animate={{ style: pulse, loop: true, backAndForth: true }}>...</div>
```

## L2008

|         |                                                |
| ------- | ---------------------------------------------- |
| Message | `reverse` moved into `more: { reverse: true }` |
| Hint    | Write `more: { reverse: true }` instead.       |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, reverse: true }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { reverse: true } }}>...</section>
```

## L2009

|         |                                             |
| ------- | ------------------------------------------- |
| Message | `loop` does not work with `WHEN.SCROLL`     |
| Hint    | Remove `loop`, or use another `WHEN` value. |

Bad:

```html
<div animate={{ style: fadeOut, when: WHEN.SCROLL, loop: true }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeOut, when: WHEN.SCROLL }}>...</div>
```

## L2010

|         |                                                      |
| ------- | ---------------------------------------------------- |
| Message | `more` is not used with `<when>`                     |
| Hint    | Remove `more`, or use an `WHEN` value that takes it. |

Bad:

```html
<button animate={{ style: glow, more: { outDelay: 200 } }}>Hover</button>
```

Fixed:

```html
<button animate={{ style: glow, when: WHEN.HOVER, more: { outDelay: 200 } }}>Hover</button>
```

## L2011

|         |                                                               |
| ------- | ------------------------------------------------------------- |
| Message | animate `more` must be an object with `<keys>`, got `<value>` |
| Hint    | Pass an object with the keys listed.                          |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: 40 }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { margin: 40 } }}>...</section>
```

## L2012

|         |                                                   |
| ------- | ------------------------------------------------- |
| Message | `more` has an unknown key `"<key>"`, use `<keys>` |
| Hint    | Check the spelling of the key.                    |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { margn: 40 } }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { margin: 40 } }}>...</section>
```

## L2013

|         |                                                                    |
| ------- | ------------------------------------------------------------------ |
| Message | animate `more` `outDuration` needs `out`                           |
| Hint    | Add `out` with the keyframes for leaving, or remove `outDuration`. |

Bad:

```html
<button animate={{ style: glow, when: WHEN.HOVER, more: { outDuration: 200 } }}>Hover</button>
```

Fixed (with `fadeOut` defined as keyframes):

```html
<button animate={{ style: glow, when: WHEN.HOVER, more: { out: fadeOut, outDuration: 200 } }}>Hover</button>
```

## L2014

|         |                                                                                            |
| ------- | ------------------------------------------------------------------------------------------ |
| Message | animate `more` `out` must be keyframes, such as `{ 0: { opacity: 1 }, 1: { opacity: 0 } }` |
| Hint    | Give `out` an object of keyframes.                                                         |

Bad:

```html
<button animate={{ style: glow, when: WHEN.HOVER, more: { out: "fade" } }}>Hover</button>
```

Fixed:

```html
<button animate={{ style: glow, when: WHEN.HOVER, more: { out: { 0: { opacity: 1 }, 1: { opacity: 0 } } } }}>Hover</button>
```

## L2015

|         |                                                               |
| ------- | ------------------------------------------------------------- |
| Message | animate `more` `start` and `end` cannot be used with `follow` |
| Hint    | Remove `start` and `end`. `follow` sets the progress.         |

Bad:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { follow: section, start: 0.2 } }}>Title</h1>
```

Fixed:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { follow: section } }}>Title</h1>
```

## L2016

|         |                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------ |
| Message | animate `more` `follow` must be a store that holds an element, such as one set by `bind-element` |
| Hint    | Use a store that `bind-element` writes to.                                                       |

Bad (`sectionEl` is a plain element, not a store):

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { follow: sectionEl } }}>Title</h1>
```

Fixed (`const sectionEl = store(null)`, then on the section):

```html
<section bind-element="{sectionEl}">...</section>
```

## L2017

|         |                                                                             |
| ------- | --------------------------------------------------------------------------- |
| Message | animate `more` `start` and `end` must be numbers, got `<start>` and `<end>` |
| Hint    | Use numbers, such as `start: 1` and `end: 0.2`.                             |

Bad:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { start: "top", end: 0.8 } }}>Title</h1>
```

Fixed:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { start: 1, end: 0.2 } }}>Title</h1>
```

## L2018

|         |                                                          |
| ------- | -------------------------------------------------------- |
| Message | animate `more` `start` and `end` must be different lines |
| Hint    | Use two different numbers for `start` and `end`.         |

Bad:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { start: 0.5, end: 0.5 } }}>Title</h1>
```

Fixed:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { start: 0.8, end: 0.2 } }}>Title</h1>
```

## L2019

|         |                                                                                      |
| ------- | ------------------------------------------------------------------------------------ |
| Message | animate `more` `part` must be `[from, to]` with `0 <= from < to <= 1`, got `<value>` |
| Hint    | Use a pair such as `[0, 0.5]`.                                                       |

Bad:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { part: [0.6, 0.4] } }}>Title</h1>
```

Fixed:

```html
<h1 animate={{ style: fade, when: WHEN.SCROLL, more: { part: [0, 0.5] } }}>Title</h1>
```

## L2020

|         |                                                                   |
| ------- | ----------------------------------------------------------------- |
| Message | animate `more` `reverse` must be `true` or `false`, got `<value>` |
| Hint    | Use `true` or `false`.                                            |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { reverse: "yes" } }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { reverse: true } }}>...</section>
```

## L2021

|         |                                                                                               |
| ------- | --------------------------------------------------------------------------------------------- |
| Message | animate `more` `margin` must be a number of px or a CSS length such as `"10%"`, got `<value>` |
| Hint    | Use a number of px, such as `40`, or a string such as `"10%"`.                                |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { margin: "ten" } }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { margin: "10%" } }}>...</section>
```

## L2022

|         |                                                                     |
| ------- | ------------------------------------------------------------------- |
| Message | animate `more` `amount` must be a number from 0 to 1, got `<value>` |
| Hint    | Use a number from 0 to 1, such as `0.5`.                            |

Bad:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { amount: 50 } }}>...</section>
```

Fixed:

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW, more: { amount: 0.5 } }}>...</section>
```

## L2023

|         |                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------- |
| Message | animate `midway` must be a `MIDWAY` member or an object such as `{ play: MIDWAY.FINISH }`, got `<value>` |
| Hint    | Use a `MIDWAY` member, or an object with `play`.                                                         |

Bad:

```html
<button animate={{ style: grow, when: WHEN.HOVER, midway: "finish" }}>Hover</button>
```

Fixed:

```html
<button animate={{ style: grow, when: WHEN.HOVER, midway: MIDWAY.FINISH }}>Hover</button>
```

## L2024

|         |                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------- |
| Message | `midway` has an unknown key `"<key>"`, use `play`, `turn`, `turnDuration`, `turnStyle` or `turnEase` |
| Hint    | Check the spelling of the key.                                                                       |

Bad:

```html
<div animate={{ style: slide, when: store, midway: { turnSpeed: 200 } }}>...</div>
```

Fixed:

```html
<div animate={{ style: slide, when: store, midway: { turnDuration: 200 } }}>...</div>
```

## L2025

|         |                                                                                        |
| ------- | -------------------------------------------------------------------------------------- |
| Message | animate `midway.play` must be a `MIDWAY` member such as `MIDWAY.FINISH`, got `<value>` |
| Hint    | Use a member of `MIDWAY`, such as `MIDWAY.FINISH`.                                     |

Bad:

```html
<button animate={{ style: grow, when: WHEN.HOVER, midway: { play: "finish" } }}>Hover</button>
```

Fixed:

```html
<button animate={{ style: grow, when: WHEN.HOVER, midway: { play: MIDWAY.FINISH } }}>Hover</button>
```

## L2026

|         |                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------- |
| Message | animate `midway.turn` must be a `TURN` member such as `TURN.SMOOTH`, or a function, got `<value>` |
| Hint    | Use a member of `TURN`, such as `TURN.SMOOTH`, or a function.                                     |

Bad:

```html
<div animate={{ style: slide, when: store, midway: { turn: "smooth" } }}>...</div>
```

Fixed:

```html
<div animate={{ style: slide, when: store, midway: { turn: TURN.SMOOTH } }}>...</div>
```

## L2027

|         |                                                                   |
| ------- | ----------------------------------------------------------------- |
| Message | animate `midway.turnDuration` must be a time in ms, got `<value>` |
| Hint    | Use a number of milliseconds, such as `200`.                      |

Bad:

```html
<div animate={{ style: slide, when: store, midway: { turn: TURN.SMOOTH, turnDuration: "fast" } }}>...</div>
```

Fixed:

```html
<div animate={{ style: slide, when: store, midway: { turn: TURN.SMOOTH, turnDuration: 200 } }}>...</div>
```

## L2028

|         |                                                                          |
| ------- | ------------------------------------------------------------------------ |
| Message | animate `midway.turnStyle` must be an `EASE.STYLE` member, got `<value>` |
| Hint    | Use a member of `EASE.STYLE`, such as `EASE.STYLE.CUBIC`.                |

Bad:

```html
<div animate={{ style: slide, when: store, midway: { turnStyle: "cubic" } }}>...</div>
```

Fixed:

```html
<div animate={{ style: slide, when: store, midway: { turnStyle: EASE.STYLE.CUBIC } }}>...</div>
```

## L2029

|         |                                                                                        |
| ------- | -------------------------------------------------------------------------------------- |
| Message | animate `midway.turnEase` must be an `EASE` member such as `EASE.INOUT`, got `<value>` |
| Hint    | Use a member of `EASE`, such as `EASE.INOUT`.                                          |

Bad:

```html
<div animate={{ style: slide, when: store, midway: { turnEase: "inout" } }}>...</div>
```

Fixed:

```html
<div animate={{ style: slide, when: store, midway: { turnEase: EASE.INOUT } }}>...</div>
```

## L2030

|         |                                                                            |
| ------- | -------------------------------------------------------------------------- |
| Message | `setAnimateDefault` has an unknown key `"<key>"`, use `ease` or `duration` |
| Hint    | Check the spelling of the key.                                             |

Bad:

```ts
setAnimateDefault({ speed: 200 });
```

Fixed:

```ts
setAnimateDefault({ duration: 200 });
```

## L2031

|         |                                                                    |
| ------- | ------------------------------------------------------------------ |
| Message | `setAnimateDefault` `duration` must be a time in ms, got `<value>` |
| Hint    | Use a number of milliseconds, such as `300`.                       |

Bad:

```ts
setAnimateDefault({ duration: "fast" });
```

Fixed:

```ts
setAnimateDefault({ duration: 300 });
```

## L2032

|         |                                                                                    |
| ------- | ---------------------------------------------------------------------------------- |
| Message | animate `default` must be `[EASE.STYLE.x, EASE.y]`, `[EASE.STYLE.x]` or `[EASE.y]` |
| Hint    | Use one of the three listed forms.                                                 |

Bad:

```ts
const fadeUp = {
  default: [EASE.STYLE.QUART, EASE.INOUT, EASE.OUT],
  0: { opacity: 0 },
  1: { opacity: 1 },
};
```

Fixed:

```ts
const fadeUp = { default: [EASE.STYLE.QUART, EASE.INOUT], 0: { opacity: 0 }, 1: { opacity: 1 } };
```

## L2033

|         |                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------- |
| Message | animate key must be a style object, `[EASE.STYLE.x, EASE.y, style]`, `[EASE.STYLE.x, style]` or `[EASE.y, style]` |
| Hint    | Use a style object, or one of the listed forms with it.                                                           |

Bad:

```ts
const fadeUp = { 0: "opacity: 0", 1: { opacity: 1 } };
```

Fixed:

```ts
const fadeUp = { 0: { opacity: 0 }, 1: { opacity: 1 } };
```

## L2034

|         |                                                                          |
| ------- | ------------------------------------------------------------------------ |
| Message | animate easing style must be a function of t, such as `EASE.STYLE.QUART` |
| Hint    | Use a member of `EASE.STYLE`, such as `EASE.STYLE.QUART`.                |

Bad:

```ts
const fadeUp = { 0: ["quart", EASE.INOUT, { opacity: 0 }], 1: { opacity: 1 } };
```

Fixed:

```ts
const fadeUp = { 0: [EASE.STYLE.QUART, EASE.INOUT, { opacity: 0 }], 1: { opacity: 1 } };
```

## L2035

|         |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| Message | animate ease must be `EASE.IN`, `EASE.OUT` or `EASE.INOUT`, got `<value>` |
| Hint    | Use a member of `EASE`, such as `EASE.INOUT`.                             |

Bad:

```ts
const fadeUp = { 0: [EASE.STYLE.QUART, "in", { opacity: 0 }], 1: { opacity: 1 } };
```

Fixed:

```ts
const fadeUp = { 0: [EASE.STYLE.QUART, EASE.IN, { opacity: 0 }], 1: { opacity: 1 } };
```

## L2036

|         |                                                            |
| ------- | ---------------------------------------------------------- |
| Message | animate keyframe `<at>` is outside 0..1                    |
| Hint    | Keyframe keys are fractions of the animation, from 0 to 1. |

Bad:

```ts
const fadeUp = { 0: { opacity: 0 }, 1.5: { opacity: 0.5 }, 1: { opacity: 1 } };
```

Fixed:

```ts
const fadeUp = { 0: { opacity: 0 }, 0.5: { opacity: 0.5 }, 1: { opacity: 1 } };
```

## L2037

|         |                                         |
| ------- | --------------------------------------- |
| Message | animate keyframe `<at>` is listed twice |
| Hint    | Keep one entry for each key.            |

Bad:

```ts
const fadeUp = {
  0: { opacity: 0 },
  0.5: { opacity: 0.5 },
  0.5: { opacity: 0.6 },
  1: { opacity: 1 },
};
```

Fixed:

```ts
const fadeUp = { 0: { opacity: 0 }, 0.5: { opacity: 0.5 }, 1: { opacity: 1 } };
```

## L2038

|         |                                                        |
| ------- | ------------------------------------------------------ |
| Message | animate keyframes must include the keys 0 and 1        |
| Hint    | Add a key `0` for the start and a key `1` for the end. |

Bad:

```ts
const fadeUp = { 0: { opacity: 0 } };
```

Fixed:

```ts
const fadeUp = { 0: { opacity: 0 }, 1: { opacity: 1 } };
```

## L2039

|         |                                                                       |
| ------- | --------------------------------------------------------------------- |
| Message | animate list changed length after it was attached                     |
| Hint    | Keep the number of animate items fixed. Only their values can change. |

Bad (the number of items depends on a store):

```html
<div animate="{extra.value" ? [{ style: fadeIn }, { style: glow }] : [{ style: fadeIn }]}>...</div>
```

Fixed (always two items, the store changes only the trigger):

```html
<div animate={[{ style: fadeIn }, { style: glow, when: extra }]}>...</div>
```

## L2040

|         |                                                           |
| ------- | --------------------------------------------------------- |
| Message | `props()` can only be called in a component's `<script>`  |
| Hint    | Call `props()` at the top level of a `.lucia` `<script>`. |

Bad:

```ts
setTimeout(() => props({ label: "New" }), 0);
```

Fixed:

```ts
const { label } = props({ label: "New" });
```

## L2041

|         |                                                       |
| ------- | ----------------------------------------------------- |
| Message | `EACH` keys must be unique, but `<key>` appears twice |
| Hint    | Give each row a key that no other row has.            |

Bad (two rows have `done` set to `false`):

```html
<EACH {todos} as="{todo}" key="{todo.done}">...</EACH>
```

Fixed:

```html
<EACH {todos} as="{todo}" key="{todo.id}">...</EACH>
```

## L2042

|         |                                                |
| ------- | ---------------------------------------------- |
| Message | `FOR` needs a step that is not 0               |
| Hint    | Use a step such as `1`, or `-1` to count down. |

Bad:

```html
<FOR {i} from="{0}" to="{10}" step="{0}">...</FOR>
```

Fixed:

```html
<FOR {i} from="{0}" to="{10}" step="{1}">...</FOR>
```

## L2043

|         |                                                               |
| ------- | ------------------------------------------------------------- |
| Message | `<attr>` needs a writable store                               |
| Hint    | Bind to a store made with `store()`, not to a computed value. |

Bad (`hot` is computed with `store.from`):

```html
<input bind="{hot}" />
```

Fixed (`const text = store("")`):

```html
<input bind="{text}" />
```

## L2044

|         |                                                                                  |
| ------- | -------------------------------------------------------------------------------- |
| Message | `ACTIVE.IN` and `ACTIVE.OUT` were renamed to `ACTIVE.ATTACH` and `ACTIVE.DETACH` |
| Hint    | Replace `IN` with `ATTACH` and `OUT` with `DETACH`.                              |

Bad:

```html
<div animate={{ style: fadeUp, when: ACTIVE.IN }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp, when: WHEN.ATTACH }}>...</div>
```

## L2045

|         |                                                             |
| ------- | ----------------------------------------------------------- |
| Message | animation was renamed to style                              |
| Hint    | Write `style: keyframes` instead of `animation: keyframes`. |

Bad:

```html
<div animate={{ animation: fadeUp }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp }}>...</div>
```

## L2046

|         |                                     |
| ------- | ----------------------------------- |
| Message | active was renamed to when          |
| Hint    | Write `when:` instead of `active:`. |

Bad:

```html
<div animate={{ style: fadeUp, active: WHEN.VIEW }}>...</div>
```

Fixed:

```html
<div animate={{ style: fadeUp, when: WHEN.VIEW }}>...</div>
```

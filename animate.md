[Back to README](../README.md)

# Animate

`animate` changes CSS values over time. You write the styles for a few key points, and the framework blends between them.

```html
<script>
import { EASE, WHEN } from "lucia";

const fadeUp = {
  default: [EASE.STYLE.QUART, EASE.OUT],
  0: { opacity: 0, translate: "0px 20px" },
  1: { opacity: 1, translate: "0px 0px" },
};

const reveal = { style: fadeUp, when: WHEN.VIEW, duration: 400 };
</script>

<div animate={reveal}>Hi</div>
<p animate={{ ...reveal, delay: 150 }}>Hi, later</p>
```

Animation is the only special attribute. Everything else lives inside its value.

## The value

`animate` takes one of these:

| Form          | Meaning                                                               |
| ------------- | --------------------------------------------------------------------- |
| `Keyframes`   | Plays once on attach with the defaults. Shorthand for `{ style: it }` |
| `AnimateItem` | One animation with its own trigger and timing                         |
| An array      | Each item plays on its own trigger                                    |

```html
<div animate={[
  { style: fadeIn, when: WHEN.VIEW, duration: 400 },
  { style: glow, when: WHEN.HOVER },
]}>...</div>
```

### AnimateItem fields

| Field          | Type                        | Default                          | Effect                                                                                                                                                                                                |
| -------------- | --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style`        | Keyframes                   | required                         | The keys to play                                                                                                                                                                                      |
| `when`         | `WHEN` member or a variable | `WHEN.ATTACH`                    | What plays it. See [Triggers](#triggers)                                                                                                                                                              |
| `control`      | controller                  | none                             | Lets code play, reverse, stop or seek the item. See [Controller](#controller)                                                                                                                         |
| `once`         | boolean                     | `false` (`true` for `WHEN.VIEW`) | Play forward only the first time. `VIEW` stays once unless `more.reverse` is set                                                                                                                      |
| `midway`       | `MIDWAY` member or object   | `MIDWAY.TURN`                    | What a new play does while one is still running. See [Midway](#midway)                                                                                                                                |
| `more`         | object                      | none                             | Options for the trigger: `margin`, `amount` and `reverse` for `VIEW`, `inDelay`, `outDelay`, `out` and `outDuration` for `HOVER`, `start`, `end`, `follow` and `part` for `SCROLL`. See [more](#more) |
| `keep`         | boolean                     | `true`                           | When `false`, the inline styles the animation wrote are removed once a play ends at progress 1                                                                                                        |
| `duration`     | ms                          | `300`                            | Length of one play                                                                                                                                                                                    |
| `delay`        | ms                          | `0`                              | Wait before each forward play                                                                                                                                                                         |
| `loop`         | boolean or count            | none                             | `true` repeats forever, `3` repeats three times                                                                                                                                                       |
| `backAndForth` | boolean                     | `false`                          | With `loop`: each repeat plays 0 to 1, then 1 to 0 (one loop pass = there and back)                                                                                                                   |

> A looping item pauses while its element is off screen, and picks up where its time has got to when it comes back. A one-off item always finishes.

Missing `style`, an unknown `when` value and keyframes without 0 or 1 throw an error. The layout triggers (`MOVE`, `RESIZE`, `MOVE_OR_RESIZE`) are the one exception: their `style` is optional.

> [!NOTE]
> `alternate` was renamed to `backAndForth`. An item that still uses `alternate` throws `alternate was renamed to backAndForth`.

> [!NOTE]
> `animation` was renamed to `style`, and `active` was renamed to `when`. An item with the old keys throws `animation was renamed to style` or `active was renamed to when`.

> [!NOTE]
> `ACTIVE.IN` and `ACTIVE.OUT` were renamed to `WHEN.ATTACH` and `WHEN.DETACH`. Old names throw `ACTIVE.IN and ACTIVE.OUT were renamed to ACTIVE.ATTACH and ACTIVE.DETACH`.

> [!NOTE]
> An unknown item key, such as `durtion`, throws `unknown animate key` with a `did you mean` hint. A dev build points at the key's own line.

> [!NOTE]
> `ease` is not an item field. Set it in the keyframes `default`. An item with `ease`, `curve` or `transition` throws, such as `ease moved into the keyframes: default: [...]`.

> [!NOTE]
> Items in an array are independent. If two items set the same CSS property, the later item wins for that property, and the earlier one does not write it. A `DETACH` item is the exception: it plays on its own, so it never takes a property from the other items.

An element can have one `ATTACH` item and one `DETACH` item, so it has different enter and leave animations.

## Triggers

| `when`                          | When it plays                                      | Notes                                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WHEN.ATTACH` (default)         | 0 to 1 once, when attached                         | Nothing on detach                                                                                                                                                        |
| `WHEN.DETACH`                   | Its own keyframes, when detaching                  | Detach waits for it. Nothing on attach. The space closes with it, unless `more.keepSpace` is set. See [Leave](#leave)                                                    |
| `WHEN.VIEW`                     | 0 to 1 when at least 15% is visible                | Once by default. `more: { reverse: true }` plays 1 to 0 when it leaves the view                                                                                          |
| `WHEN.HOVER`                    | 0 to 1 on pointer enter, 1 to 0 on leave           | Leave plays from the current progress. `more` sets delays and a separate way out. Touch: a tap toggles, a tap outside plays out. Focus counts as enter and blur as leave |
| `WHEN.SCROLL`                   | The progress follows the element's place on screen | Scroll-linked. `duration`, `delay`, `once` and `loop` do not apply. `loop` is an error                                                                                   |
| `WHEN.MOVE`                     | Glides when the element's place changes            | Automatic, for any cause. See [Layout](#layout)                                                                                                                          |
| `WHEN.RESIZE`                   | Glides when the element's size changes             | Automatic. Ignores place changes. See [Layout](#layout)                                                                                                                  |
| `WHEN.MOVE_OR_RESIZE`           | Glides when the place or the size changes          | Automatic. See [Layout](#layout)                                                                                                                                         |
| `WHEN.MANUAL`                   | Only when a controller plays it                    | No automatic trigger                                                                                                                                                     |
| A variable or computed variable | Truthy: 0 to 1. Falsy: 1 to 0                      | Read reactively. The first value is applied without animating                                                                                                            |

> [!IMPORTANT]
> Only `DETACH` items delay the removal of the nodes on detach. `VIEW`, `HOVER` and variable items do not.

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW }}>...</section>
<button animate={{ style: grow, when: WHEN.HOVER }}>Hover me</button>
<div animate={{ style: pulse, when: isOpen }}>...</div>
```

`once` on `HOVER` or a variable plays forward only the first time. `VIEW` already plays once unless `more.reverse` is set.

## more

`more` holds the options of one trigger. Each trigger takes only its own keys. A key from another trigger is an error that lists the allowed keys.

| Trigger       | Key           | Type                                 | Default           | Effect                                                                                                                                                                          |
| ------------- | ------------- | ------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WHEN.VIEW`   | `margin`      | number or CSS length                 | `0`               | How far inside the screen edge the element must be before it counts as in view. A number is px. A string such as `"10%"` works too. Positive values need the element further in |
| `WHEN.VIEW`   | `amount`      | number, 0 to 1                       | `0.15`            | Share of the screen the element must cover. A tall element counts against the screen, so it can still reach the amount                                                          |
| `WHEN.VIEW`   | `reverse`     | boolean                              | `false`           | Play back out when the element leaves the view, and again on re-entry                                                                                                           |
| `WHEN.HOVER`  | `inDelay`     | ms                                   | `0`               | Wait after pointer enter before playing in. Leaving inside the wait cancels it                                                                                                  |
| `WHEN.HOVER`  | `outDelay`    | ms                                   | `0`               | Wait after pointer leave before playing back. Entering again inside the wait cancels it                                                                                         |
| `WHEN.HOVER`  | `out`         | keyframes                            | none              | The animation for leaving. It starts from the look the element has at that moment, so nothing jumps. Without it, the in plays backward                                          |
| `WHEN.HOVER`  | `outDuration` | ms                                   | item `duration`   | Length of the way out. Needs `out`                                                                                                                                              |
| `WHEN.SCROLL` | `start`       | `SCROLL_AT` or `{ element, window }` | `SCROLL_AT.ENTER` | Where the progress is 0. See [SCROLL points](#scroll-points)                                                                                                                    |
| `WHEN.SCROLL` | `end`         | `SCROLL_AT` or `{ element, window }` | `SCROLL_AT.LEAVE` | Where the progress is 1. Same form as `start`                                                                                                                                   |
| `WHEN.SCROLL` | `follow`      | variable of an element               | none              | The element whose box is measured instead of the item's own. Alone it is pinned to the screen. With `start` and `end` it runs like the item's own box. See [Pinned scroll](#pinned-scroll) and [Follow with start and end](#follow-with-start-and-end) |
| `WHEN.SCROLL` | `part`        | `[from, to]`                         | `[0, 1]`          | Plays only that slice of the progress. `[0.5, 1]` plays in the second half. Needs `0 <= from < to <= 1`                                                                         |
| `WHEN.DETACH` | `keepSpace`   | boolean                              | `false`           | Keeps the space the element holds until it is removed. Without it, the space closes with the leave. See [Leave](#leave)                                                         |

```html
<section animate={{ style: PRESET.SLIDE_UP, when: WHEN.VIEW, more: { margin: "10%", amount: 0.5, reverse: true } }}>...</section>
<button animate={{ style: glow, when: WHEN.HOVER, more: { outDelay: 200 } }}>Hover me</button>
<div animate={{ style: fadeOut, when: WHEN.SCROLL, more: { start: SCROLL_AT.CENTER, end: SCROLL_AT.LEAVE } }}>...</div>
```

> [!NOTE]
> `WHEN.VIEW` items with the same margin and amount share one observer. The observer is removed when its last item detaches.

> [!NOTE]
> `reverse` at the top level of an item is an error: `reverse moved into more: { reverse: true }`.

### SCROLL points

`start` and `end` each name a moment: when a point on the element meets a point on the window.

| Member             | Element point          | Window point           | Default for |
| ------------------ | ---------------------- | ---------------------- | ----------- |
| `SCROLL_AT.ENTER`  | top (`EDGE.TOP`)       | bottom (`EDGE.BOTTOM`) | `start`     |
| `SCROLL_AT.CENTER` | centre (`EDGE.CENTER`) | centre (`EDGE.CENTER`) | none        |
| `SCROLL_AT.LEAVE`  | bottom (`EDGE.BOTTOM`) | top (`EDGE.TOP`)       | `end`       |

Write your own pair with an object. `element` is the point on the element, `window` the point on the window:

```html
<div animate={{ style: fadeOut, when: WHEN.SCROLL, more: { start: { element: EDGE.TOP, window: EDGE.CENTER } } }}>...</div>
```

| Field     | Type                                  | Meaning                                       |
| --------- | ------------------------------------- | --------------------------------------------- |
| `element` | `EDGE` member or a number from 0 to 1 | `0` is the top of the element, `1` the bottom |
| `window`  | `EDGE` member or a number from 0 to 1 | `0` is the top of the window, `1` the bottom  |

`EDGE` values: `EDGE.TOP` (0), `EDGE.CENTER` (0.5), `EDGE.BOTTOM` (1).

> [!NOTE]
> Numbers for `start` and `end` (such as `start: 0.2`) are an error. Use `SCROLL_AT` or `{ element, window }`.

```text
ENTER: element top meets window bottom (progress 0)

   +------------------+  window top
   |                  |
   +==================+  window bottom = element top
   |  element         |
   +------------------+


CENTER: element centre meets window centre (progress 0.5)

   +------------------+  window top
   |  +------------+  |
   |==|  element   |==|  window centre = element centre
   |  +------------+  |
   +------------------+  window bottom


LEAVE: element bottom meets window top (progress 1)

   +------------------+
   |  element         |
   +==================+  window top = element bottom
   |                  |
   +------------------+  window bottom
```

Progress is linear between the two moments and clamped to 0 to 1. Keyframe curves still shape each segment. With reduced motion, a scroll item shows its end state (progress 1) and does not listen for scroll.

### Pinned scroll

Use `follow` to play a scene while a tall section scrolls past, with the scene held on screen. Set the section with [bind-element](events.md#bind-element). Then put the scene in a sticky box inside it:

```html
<script>
import { variable, WHEN, PRESET } from "lucia";

const section = variable(null);
</script>

<section bind-element={section} style="height: 300vh">
  <div style="position: sticky; top: 0; height: 100vh">
    <h1 animate={{ style: PRESET.FADE, when: WHEN.SCROLL, more: { follow: section } }}>Title</h1>
  </div>
</section>
```

- The tall section is the one to follow. Its top edge reaching the top of the screen is 0. Its bottom edge reaching the bottom of the screen is 1.
- The sticky box keeps the scene on screen while the section scrolls.
- An element shorter than the screen goes from 0 to 1 once its top passes the top edge.
- While the variable is `null`, progress is 0.
- `part` plays only one slice of the progress. Two items can play one after another: `part: [0, 0.5]` and `part: [0.5, 1]`.

> [!NOTE]
> Many items can follow the same section. The section is measured once per frame, not once per item.

### Follow with start and end

Add `start` and `end` to `follow` to play from points on the followed element, the same as an item's own box. A short section works here, because the points set the range. Set `part` only without `start` and `end`.

```html
<section bind-element={section}>
  <h2 animate={{ style: rise, when: WHEN.SCROLL, more: {
    follow: section,
    start: SCROLL_AT.ENTER,
    end: { element: EDGE.TOP, window: 0.33 },
  } }}>Title</h2>
</section>
```

The title rises from the moment the section enters at the bottom, and is done when the section's top edge reaches a third of the way down the screen.

## SCROLL guide

Each example below has a live demo in the [Guide](../README.md), under Motion. The demo shows a readout, from 0 to 1, that moves as you scroll.

### The default range

With no `start` or `end`, the range is `SCROLL_AT.ENTER` to `SCROLL_AT.LEAVE`. The item moves for the whole time the element is on screen.

```html
<div animate={{ style: rise, when: WHEN.SCROLL }}>Card</div>
```

- Progress 0 when the element's top meets the bottom of the window.
- Progress 1 when its bottom meets the top of the window.

### Finish in the middle

```html
<div animate={{ style: rise, when: WHEN.SCROLL, more: { start: SCROLL_AT.ENTER, end: SCROLL_AT.CENTER } }}>Card</div>
```

The item reaches 1 when the element's centre reaches the middle of the window. After that it stays at its end style.

### Fade out as it leaves

```html
<div animate={{ style: fadeOut, when: WHEN.SCROLL, more: { start: SCROLL_AT.CENTER, end: SCROLL_AT.LEAVE } }}>Card</div>
```

### Presets side by side

Presets move the element, so they use a lane: a tall section with the cards in a sticky box. The cards follow the section, and the section's own box stays still:

```html
<section bind-element={lane} style="height: 220vh">
  <div style="position: sticky; top: 0; height: 100vh">
    <div animate={{ style: PRESET.SLIDE_UP, when: WHEN.SCROLL, more: { follow: lane } }}>Up</div>
    <div animate={{ style: PRESET.SLIDE_DOWN, when: WHEN.SCROLL, more: { follow: lane } }}>Down</div>
  </div>
</section>
```

### Points with EDGE or numbers

An object takes a point on the element and a point on the window. `EDGE` members and numbers from 0 to 1 both work:

```html
<div animate={{ style: fadeIn, when: WHEN.SCROLL, more: {
  start: { element: EDGE.TOP, window: EDGE.CENTER },
  end: { element: 0.75, window: 0.25 },
} }}>Card</div>
```

| Point          | Example       | Meaning                  |
| -------------- | ------------- | ------------------------ |
| `element: 0`   | `EDGE.TOP`    | the element's top        |
| `element: 0.5` | `EDGE.CENTER` | the element's middle     |
| `element: 1`   | `EDGE.BOTTOM` | the element's bottom     |
| `window: 0`    | `EDGE.TOP`    | the top of the window    |
| `window: 1`    | `EDGE.BOTTOM` | the bottom of the window |

### Start and end lines

The window line and the element line meet at a start or end. In the Guide, the lines turn red when they meet.

```text
window top     ----------------  the window line
element top    ================  the element line, meets the window line
```

### Two items on one element

An array can give one element two items, one for each half of the scroll. Each item must set a different CSS property. If two items set the same property, the later item wins.

```html
<div animate={[
  { style: fadeIn, when: WHEN.SCROLL, more: { start: SCROLL_AT.ENTER, end: SCROLL_AT.CENTER } },
  { style: blurOut, when: WHEN.SCROLL, more: { start: SCROLL_AT.CENTER, end: SCROLL_AT.LEAVE } },
]}>Card</div>
```

Here `fadeIn` sets `opacity` and `blurOut` sets `filter`, so they do not fight.

### Slices with part and a pinned scene

`part` plays one slice of a section's progress. With `follow`, the section drives the progress and a sticky box holds the scene on screen. This example plays three steps, each in its own third of the section:

```html
<section bind-element={section} style="height: 300vh">
  <div style="position: sticky; top: 0; height: 100vh">
    <p animate={{ style: pulse, when: WHEN.SCROLL, more: { follow: section, part: [0, 0.33] } }}>Step 1</p>
    <p animate={{ style: pulse, when: WHEN.SCROLL, more: { follow: section, part: [0.33, 0.66] } }}>Step 2</p>
    <p animate={{ style: pulse, when: WHEN.SCROLL, more: { follow: section, part: [0.66, 1] } }}>Step 3</p>
  </div>
</section>
```

A step with `pulse` keys that go back to 0 at the end of its slice is hidden outside it.

### Progress bar, parallax and colour

- A page progress bar: `follow` a variable that holds `document.documentElement`. The root is the tall element, so the bar fills over the whole page.
- Parallax: layers with different `translate` ends, both with `follow` on a tall lane. The one that moves more looks nearer.
- Rotate, scale and colour: put them on a card in the same lane, with `follow`. Colour and opacity can also use the default range.

### Reverse

A scroll item follows the position, not time. Scrolling back up plays the item in reverse, and nothing needs to be set. A scroll item never loops, so `loop` is an error.

### Common mistakes

| Mistake                                                    | What you see                                                                                   | Fix                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| A number for `start` or `end`                              | `animate more start is a number, which is no longer used`                                      | Write `start: SCROLL_AT.ENTER`, or `start: { element: EDGE.TOP, window: EDGE.BOTTOM }` |
| The same start and end                                     | `animate more start and end must be different moments`                                         | Use two different points                                                               |
| `start` after `end` in scroll order                        | No error. The progress still goes 0 to 1, so the motion runs the other way                     | Swap the two if you expected the other order                                           |
| A tall element with a short range                          | The range is the window height plus the element height. The item plays slowly                  | Use `follow` with a sticky box for a scene that is taller than the window              |
| `translate`, `scale` or `rotate` on the item's own element | The progress reads the element's box, and the transform moves that box, so the progress drifts | Use `follow` with a lane, or use `opacity`, `filter` and colour on the element itself  |

## Layout

`WHEN.MOVE`, `WHEN.RESIZE` and `WHEN.MOVE_OR_RESIZE` glide an element from its old box to its new one. You do not write any keyframes. The change can come from a class toggle, a sibling inserted or removed, a flex reflow, or a window resize.

A move slides the element with a `translate`, so only its place changes. A resize animates the element's real `width` and `height`, so its text, borders and children keep their shape while the size grows.

> Inline `style` changes are not watched, so a move that only comes from an inline style is seen at the next scroll or resize. Put the change in a class to glide it at once.

| `when`                | The glide runs when                  |
| --------------------- | ------------------------------------ |
| `WHEN.MOVE`           | The place changes. Size changes wait |
| `WHEN.RESIZE`         | The size changes. Place changes wait |
| `WHEN.MOVE_OR_RESIZE` | Either one changes                   |

```html
<script>
import { WHEN, variable } from "lucia";

const floating = variable(false);
const glide = { when: WHEN.MOVE, duration: 400 };
</script>

<div class={floating.value ? "search fixed" : "search"} animate={glide}>...</div>
```

### Examples

**Topbar search moves to the center.** The search sits at the right of the bar. When the page scrolls past the hero, a class puts it in `position: fixed` at the center. It glides to the new place.

```html
<script>
import { WHEN, variable } from "lucia";

const floating = variable(false);
const glide = { when: WHEN.MOVE, duration: 400 };
</script>

<header class="topbar">
  <div class={floating.value ? "search search-center" : "search"} animate={glide}>
    <input type="search" placeholder="Search" />
  </div>
</header>
```

**List reorder.** Each row is a flex item. When the array changes order, every row glides to its new place.

```html
<ul class="list">
  <EACH {names.value} as={name} key={name}>
    <li animate={{ when: WHEN.MOVE, duration: 400 }}>{name}</li>
  </EACH>
</ul>
```

**Accordion resize.** A panel grows and shrinks when its content opens. `WHEN.RESIZE` glides the size, and the top edge stays where the layout puts it.

```html
<section class="panel" animate={{ when: WHEN.RESIZE, duration: 300 }}>
  <h3>Details</h3>
  <IF {open.value}>
    <p>The hidden text.</p>
  </IF>
</section>
```

### Rules

| Rule                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------- |
| `duration`, `delay` and the keyframes `default` ease set the glide. The engine default fills what is missing              |
| `style` is optional. With a `style`, its keys play along the glide, such as a fade. They use the same timing and `midway` |
| `once` glides only the first change. `loop` is an error                                                                   |
| A change during a glide starts from the box the element shows now, so nothing jumps                                       |
| `translate` and `scale` belong to the glide. Keyframes cannot set them                                                    |
| With reduced motion, the element jumps to its new box                                                                     |
| A scroll does not glide. Only a change in the layout box does                                                             |

> [!NOTE]
> `WHEN.RESIZE` changes the element's real width and height, so its content reflows on every frame. Keep the number of resizing elements small, and avoid it on content that is expensive to lay out.

> [!NOTE]
> The glide writes `translate` inline, and `width` and `height` for `WHEN.RESIZE`. At the end it removes them, or puts back an inline size the element already had. A class that sets `translate` on the same element is overridden during the glide. Use `transform` for a fixed move instead.

> [!TIP]
> `WHEN.RESIZE` keeps the top-left corner where the layout puts it, so a panel grows downward. The element's `transform-origin` does not affect the glide.

## Midway

A play can be asked for while another one is still running: a hover leaves mid-way, a variable flips, or code calls `play()` or `reverse()`. `midway` sets what happens then.

| `midway`                | What the new play does                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `MIDWAY.TURN` (default) | Starts at once, from the current progress. `turn` shapes the change                    |
| `MIDWAY.FINISH`         | Waits for the running play to end. If several requests come in, only the last one runs |
| `MIDWAY.RESTART`        | Starts from its own beginning. The element snaps there                                 |
| `MIDWAY.SKIP`           | Jumps the running play to its end, then runs the new one                               |
| `MIDWAY.IGNORE`         | Drops the request                                                                      |

`turn` only matters for `TURN`, and for the switch of `FINISH` and `SKIP`:

| `turn`                  | How the motion changes                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `TURN.SUDDEN` (default) | The new play starts from the current progress. Its speed may jump                                                |
| `TURN.SMOOTH`           | Keeps the current speed and bends into the new direction over `turnDuration`. Position and speed stay continuous |
| `TURN.STOP`             | Slows to rest over half of `turnDuration`, then starts the new play                                              |

Set the options in an object. A `MIDWAY` member alone sets only `play`:

| Key            | Type                        | Default            | Effect                           |
| -------------- | --------------------------- | ------------------ | -------------------------------- |
| `play`         | `MIDWAY` member             | `MIDWAY.TURN`      | What the new play does           |
| `turn`         | `TURN` member or a function | `TURN.SUDDEN`      | How the motion changes direction |
| `turnDuration` | ms                          | `200`              | Length of the change             |
| `turnStyle`    | `EASE.STYLE` member         | `EASE.STYLE.CUBIC` | Easing style of the blend        |
| `turnEase`     | `EASE` member               | `EASE.INOUT`       | Ease of the blend                |

```html
<button animate={{ style: grow, when: WHEN.HOVER, midway: MIDWAY.FINISH }}>Hover me</button>
<div animate={{ style: slide, when: variable, midway: { turn: TURN.SMOOTH, turnDuration: 250 } }}>...</div>
```

A custom `turn` function gets `(from, to, t, speed)`. `from` is the progress at the switch, `to` is where the new play is now, `t` is the ms since the switch, and `speed` is progress per ms. It returns the progress to show until `turnDuration` has passed.

> [!NOTE]
> Speed is tracked every frame, from the values the element shows. No allocation happens per frame for it.

## Keyframes

A keyframes object maps progress keys to a step each. A key is a number from 0 to 1. 0 is the start, 1 is the end.

```ts
import type { Keyframes } from "lucia";

const fade: Keyframes = {
  default: [EASE.STYLE.QUART, EASE.INOUT],
  0: { opacity: 0 },
  0.5: [EASE.IN, { opacity: 0.8 }],
  1: { opacity: 1 },
};
```

| Part      | Meaning                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `default` | Optional. The easing for keys that do not set their own. Its forms are `[EASE.STYLE.x, ease]`, `[EASE.STYLE.x]` and `[EASE.y]` |
| Key       | Progress from 0 to 1. Must include `0` and `1`. Keys outside 0 to 1, or listed twice, throw                                    |
| Name      | Only `default` or a number. Any other name throws `unknown keyframes key`, with a `did you mean` hint for a typo               |
| Value     | One of the four key forms below                                                                                                |
| `style`   | CSS properties in camelCase, such as `backgroundColor`. Custom properties start with `--`                                      |

### Key forms

| Form                            | Example                                        | Easing used                                                    |
| ------------------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| `{ css }`                       | `{ opacity: 0 }`                               | The defaults: the keyframes `default`, then the engine default |
| `[ease, { css }]`               | `[EASE.IN, { opacity: 1 }]`                    | The written ease. The style comes from the defaults            |
| `[EASE.STYLE.x, { css }]`       | `[EASE.STYLE.QUAD, { opacity: 1 }]`            | The written style. The ease comes from the defaults            |
| `[EASE.STYLE.x, ease, { css }]` | `[EASE.STYLE.QUART, EASE.OUT, { opacity: 1 }]` | Both written                                                   |

An ease is one of `EASE.IN`, `EASE.OUT` or `EASE.INOUT`. A style is a function from `EASE.STYLE`, or your own function. Any other shape throws.

Key 0 is the start, so its easing is never used. It can always be a plain `{ css }`.

The keyframes value is read again at the start of every play. Keyframes built from variables pick up new values.

### Defaults

Each part of the easing (style and ease) is looked up in three levels. The first one that sets it wins:

| Level     | Set by                                                   | Used for                       |
| --------- | -------------------------------------------------------- | ------------------------------ |
| Key       | The key's own form, such as `[EASE.IN, { ... }]`         | That key                       |
| Keyframes | `default: [...]` in the keyframes                        | Keys that do not set that part |
| Engine    | The library: `EASE.STYLE.QUART` and `EASE.INOUT`, 300 ms | Anything no level above sets   |

The style and the ease are looked up separately. A key can set only its ease, and take its style from the keyframes default.

Change the engine default for the whole app with `setAnimateDefault`:

```ts
import { setAnimateDefault, EASE } from "lucia";

setAnimateDefault({ ease: [EASE.STYLE.CUBIC, EASE.OUT], duration: 400 });
```

| Key        | Effect                                                                              |
| ---------- | ----------------------------------------------------------------------------------- |
| `ease`     | Takes the same forms as `default`. Each part merges with the current engine default |
| `duration` | Replaces the 300 ms default. An item's own `duration` still wins                    |

It is read at each play, so a call at app start applies everywhere. A play that is already running keeps the default it started with. Other keys throw.

### Easing belongs to the segment that ends at the key

A segment is the stretch between two keys. Its style and ease come from the key where it ends.

```
key 0 ---- uses key 0.5's style and ease ----> key 0.5 ---- uses key 1's style and ease ----> key 1
```

Key 0 has no segment that ends at it, so its easing is not used going forward.

A reverse play runs each segment backward with the same style, so the motion looks the same, only backward.

## EASE

### STYLE

`EASE.STYLE` holds the easing styles. Each member is a function `(t) => number` that goes from 0 at `t = 0` to 1 at `t = 1`.

| Member    | Style                        | Use                             |
| --------- | ---------------------------- | ------------------------------- |
| `LINEAR`  | Constant speed               | Motion that should not speed up |
| `QUAD`    | Gentle curve                 | Small moves                     |
| `CUBIC`   | Stronger curve               | Most UI motion                  |
| `QUART`   | Strong curve                 | Large moves                     |
| `QUINT`   | Very strong curve            | Dramatic entrances              |
| `SINE`    | Soft curve                   | Fades and small moves           |
| `EXPO`    | Very fast start, long settle | Snappy reveals                  |
| `CIRC`    | Round curve                  | Arcs                            |
| `BACK`    | Pulls back, then overshoots  | Playful motion                  |
| `ELASTIC` | Springs around the end       | Springy motion                  |
| `BOUNCE`  | Bounces like a ball          | Drops and landings              |

### Your own style

Any function of the same shape works as a style, in a key or in `default`. No registration is needed.

```ts
const SOFT = (t: number) => t * t;

const slide = {
  default: [SOFT, EASE.OUT],
  0: { translate: "-20px 0px" },
  1: { translate: "0px 0px" },
};
```

### Directions

`EASE.IN`, `EASE.OUT` and `EASE.INOUT` decide how a style plays in a segment.

| Member       | Shape              | Feel                              |
| ------------ | ------------------ | --------------------------------- |
| `EASE.IN`    | The curve as it is | Starts slow, ends fast            |
| `EASE.OUT`   | The curve flipped  | Starts fast, ends slow            |
| `EASE.INOUT` | Slow at both ends  | Slow start, fast middle, slow end |

> [!TIP]
> `EASE.OUT` suits most entrances. `BACK`, `ELASTIC` and `BOUNCE` show their effect best with `EASE.OUT`.

## Values

| Value                       | Example                                                          | How it moves                                               |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Number                      | `opacity: 0`                                                     | Blends in a straight line                                  |
| Text with numbers and units | `"10px 0px"`                                                     | Each number blends, the text around it stays               |
| Zero without a unit         | `"0 0"` to `"0 20px"`                                            | The 0 takes the unit of the other side, so it tweens       |
| Different length units      | `"0px"` to `"-12vh"`                                             | Blends through `calc()`, e.g. `calc(0px + -6vh)`           |
| Color                       | `"#e11d48"`, `"rgb(0 0 0 / 50%)"`, `"hsl(200 80% 50%)"`, `"red"` | Blends red, green, blue and alpha                          |
| CSS variable                | `"var(--accent)"`                                                | Resolved on the animated element, so scoped variables work |
| Different shapes            | `"10px"` to `"auto"`                                             | No blend. Switches at the middle                           |

- A property missing from a key takes the value of the nearest key that sets it.
- Named colors and `hsl()` are read from the browser once per play, not on every frame.

## Controller

A controller plays items by hand. Use it with `WHEN.MANUAL`, or with any trigger.

```ts
import { WHEN, controller } from "lucia";

const ctl = controller();
```

```html
<div animate={{ style: pop, when: WHEN.MANUAL, control: ctl }}>...</div>
```

| Method               | What it does                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `ctl.play()`         | Plays 0 to 1. Returns a promise that resolves when the play ends |
| `ctl.reverse()`      | Plays 1 to 0. Returns a promise that resolves when the play ends |
| `ctl.stop()`         | Ends the play where it is                                        |
| `ctl.seek(progress)` | Jumps to a progress from 0 to 1                                  |

One controller can drive several items and elements.

## PRESET

`PRESET` holds ready-made keyframes. Use one as the style, or as a base to change.

```html
<script>
import { WHEN, PRESET } from "lucia";
</script>

<div animate={PRESET.FADE}>Plays once on attach</div>
<section animate={{ style: PRESET.SLIDE_UP, when: WHEN.VIEW, duration: 500 }}>...</section>
```

| Member        | Effect                                                              |
| ------------- | ------------------------------------------------------------------- |
| `FADE`        | Fades in from transparent                                           |
| `SLIDE_UP`    | Comes up from below: moves up 24px into place while fading in       |
| `SLIDE_DOWN`  | Comes down from above: moves down 24px into place while fading in   |
| `SLIDE_LEFT`  | Comes in from the left: moves right 24px into place while fading in |
| `SLIDE_RIGHT` | Comes in from the right: moves left 24px into place while fading in |
| `POP`         | Grows from 80% size while fading in                                 |
| `ZOOM`        | Grows from nothing to full size                                     |
| `SHAKE`       | Shakes sideways 10px, then settles                                  |
| `PULSE`       | Grows to 110% and back                                              |
| `SPIN`        | One full turn                                                       |
| `FLIP`        | Turns into view around the vertical axis while fading in            |

Presets use `translate`, `scale` and `rotate`, not `transform`. They combine with the element's own `transform`. Their keys set only styles, and each preset has its own `default` (CUBIC and OUT), so they need no easing.

> [!TIP]
> To change a preset, spread it and replace the keys you need: `{ ...PRESET.FADE, 1: { opacity: 0.5 } }`.

## Overriding patterns

| Need                            | Pattern                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| A variant of a keyframes object | Spread it and replace one key: `{ ...fadeUp, 1: [EASE.STYLE.QUART, EASE.OUT, { opacity: 0.5 }] }` |
| Many similar animations         | A function that returns the keyframes: `animate={fadeUp(20)}`                                     |
| One item with other timing      | Use the item form: `{ style: fadeUp, duration: 600 }`                                             |

```ts
function fadeUp(distance: number): Keyframes {
  return {
    default: [EASE.STYLE.QUART, EASE.OUT],
    0: { opacity: 0, translate: `0px ${distance}px` },
    1: { opacity: 1, translate: "0px 0px" },
  };
}
```

## Leave

`detach()` returns a promise. It resolves when the `DETACH` animations have finished and the nodes are removed.

```ts
const card = attach(Card, slot);
await card.detach(); // the nodes are gone when this resolves
```

| Case                                               | Result                                                      |
| -------------------------------------------------- | ----------------------------------------------------------- |
| No `DETACH` items                                  | Nodes are removed at once, and the promise resolves at once |
| `DETACH` starts while an `ATTACH` is still running | It plays its own keyframes from the current style           |
| A child component has `DETACH` items               | The parent waits for them too                               |

### Closing the space

A removed row would leave a gap until it is gone, and then the rows below jump. So a `DETACH` item also closes the space the element holds. The rows below slide up while the row leaves, over the same `duration`, `delay` and ease as the leave.

When the leave starts, the element leaves the flow and stays where it was. A placeholder takes its place in the layout:

1. The placeholder has the element's size, margins and grid or flex cell.
2. Its size on the layout axis shrinks to `0`.
3. Its margins go to `0`, and its end margin goes to minus the parent's gap. The gap closes too.
4. When the leave ends, the placeholder and the element are removed together.

The element keeps its own size, rotation and other keyframes, because it is out of the flow and not clipped.

| Element                                        | Space that closes                                  |
| ---------------------------------------------- | -------------------------------------------------- |
| Item in a column or block                      | Height, top and bottom margin, and the row gap     |
| Item in a `display: flex` row                  | Width, left and right margin, and the column gap   |
| Item in a grid                                 | Its height in the row. See the note below          |
| Inline element, or `position: absolute` / fixed | Nothing. It fades in place                         |

> [!NOTE]
> In a grid, a row that holds only the leaving item keeps one row gap until the item is removed. A row shared with other items does not move. CSS does not let a margin remove a grid row gap.

If the leave is cancelled before it ends, for example when the component is torn down mid-leave, the space reopens from where it is. The siblings slide back, and the element returns to the flow with no jump.

```html
<li animate={{ style: fadeOut, when: WHEN.DETACH, duration: 300 }}>...</li>
<li animate={{ style: fadeOut, when: WHEN.DETACH, more: { keepSpace: true } }}>...</li>
```

`more: { keepSpace: true }` keeps the old behaviour, where the space stays until the row is removed.

## Reduced motion

When the user sets `prefers-reduced-motion: reduce`, nothing moves. An animation jumps to its end state, and a leave removes the nodes at once. Promises still resolve.

## interpolate()

`interpolate(from, to)` blends two values with the same engine that `animate` uses.

```ts
import { interpolate } from "lucia";

const mix = interpolate("0px", "100px");
mix(0.5); // "50px"
```

It returns a function. Call it with `t` from 0 to 1. It handles numbers, text with units, colors, arrays and plain objects.

> [!NOTE]
> Build the function once and call it many times. Building it does the parsing work.

## Known limits

| Limit                                                                                        | What to do                                                            |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| No `auto` sizes. `height: auto` cannot tween                                                 | Animate a fixed value, or animate `scale` instead                     |
| Touch has no hover. `WHEN.HOVER` uses taps there: a tap toggles, and a tap outside plays out | For content that should play on scroll, use `WHEN.VIEW`               |
| `WHEN.SCROLL` does not reload keyframes that come from variables while it runs               | Set the keyframes before the element mounts                           |
| A change during a layout glide keeps the place, but its speed starts again at rest           | Use a short `duration` for items that change often                    |
| No stagger helper. Delays for a list are set by hand                                         | Give each item its own `delay`                                        |
| Frames are driven by JavaScript, not the compositor                                          | Keep the number of animated elements moderate. See the stress example |
| Layout properties (`width`, `top`, `margin`) are slow                                        | Animate `transform` and `opacity` where you can                       |

## Types

| Type            | Shape                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Keyframes`     | `{ default?: DefaultEasing; 0: KeyframeValue; 1: KeyframeValue } & Record<number, KeyframeValue>`                                                                                  |
| `KeyframeValue` | `Style`, `[Ease, Style]`, `[EaseStyle, Style]` or `[EaseStyle, Ease, Style]`                                                                                                       |
| `DefaultEasing` | `[EaseStyle, Ease]`, `[EaseStyle]` or `[Ease]`                                                                                                                                     |
| `Style`         | The DOM style properties in camelCase (`opacity`, `backgroundColor`), with numbers or strings, and `--custom` properties                                                           |
| `AnimateItem`   | A union on `when`: `more` is typed by the trigger. For example `ViewMore` on `WHEN.VIEW`, `HoverMore` on `WHEN.HOVER`, and no `more` on `ATTACH`, `DETACH`, `MANUAL` or a variable |
| `EaseStyle`     | `(t: number) => number`, such as `EASE.STYLE.QUART`                                                                                                                                |
| `Ease`          | One of `EASE.IN`, `EASE.OUT`, `EASE.INOUT`                                                                                                                                         |
| `Animate`       | `Keyframes \| AnimateItem \| (Keyframes \| AnimateItem)[]`                                                                                                                         |

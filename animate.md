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

| Field          | Type                      | Default                          | Effect                                                                                                                                                                                                |
| -------------- | ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style`        | Keyframes                 | required                         | The keys to play                                                                                                                                                                                      |
| `when`         | `WHEN` member or a store  | `WHEN.ATTACH`                    | What plays it. See [Triggers](#triggers)                                                                                                                                                              |
| `control`      | controller                | none                             | Lets code play, reverse, stop or seek the item. See [Controller](#controller)                                                                                                                         |
| `once`         | boolean                   | `false` (`true` for `WHEN.VIEW`) | Play forward only the first time. `VIEW` stays once unless `more.reverse` is set                                                                                                                      |
| `midway`       | `MIDWAY` member or object | `MIDWAY.TURN`                    | What a new play does while one is still running. See [Midway](#midway)                                                                                                                                |
| `more`         | object                    | none                             | Options for the trigger: `margin`, `amount` and `reverse` for `VIEW`, `inDelay`, `outDelay`, `out` and `outDuration` for `HOVER`, `start`, `end`, `follow` and `part` for `SCROLL`. See [more](#more) |
| `keep`         | boolean                   | `true`                           | When `false`, the inline styles the animation wrote are removed once a play ends at progress 1                                                                                                        |
| `duration`     | ms                        | `300`                            | Length of one play                                                                                                                                                                                    |
| `delay`        | ms                        | `0`                              | Wait before each forward play                                                                                                                                                                         |
| `loop`         | boolean or count          | none                             | `true` repeats forever, `3` repeats three times                                                                                                                                                       |
| `backAndForth` | boolean                   | `false`                          | With `loop`: each repeat plays 0 to 1, then 1 to 0 (one loop pass = there and back)                                                                                                                   |

Missing `style`, an unknown `when` value and keyframes without 0 or 1 throw an error.

> [!NOTE]
> `alternate` was renamed to `backAndForth`. An item that still uses `alternate` throws `alternate was renamed to backAndForth`.

> [!NOTE]
> `animation` was renamed to `style`, and `active` was renamed to `when`. An item with the old keys throws `animation was renamed to style` or `active was renamed to when`.

> [!NOTE]
> `ACTIVE.IN` and `ACTIVE.OUT` were renamed to `WHEN.ATTACH` and `WHEN.DETACH`. Old names throw `ACTIVE.IN and ACTIVE.OUT were renamed to ACTIVE.ATTACH and ACTIVE.DETACH`.

> [!NOTE]
> `ease` is not an item field. Set it in the keyframes `default`. An item with `ease`, `curve` or `transition` throws, such as `ease moved into the keyframes: default: [...]`.

> [!NOTE]
> Items in an array are independent. If two items set the same CSS property, the later item wins for that property, and the earlier one does not write it.

An element can have one `ATTACH` item and one `DETACH` item, so it has different enter and leave animations.

## Triggers

| `when`                  | When it plays                                      | Notes                                                                                                                                                                    |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WHEN.ATTACH` (default) | 0 to 1 once, when attached                         | Nothing on detach                                                                                                                                                        |
| `WHEN.DETACH`           | Its own keyframes, when detaching                  | Detach waits for it. Nothing on attach                                                                                                                                   |
| `WHEN.VIEW`             | 0 to 1 when at least 15% is visible                | Once by default. `more: { reverse: true }` plays 1 to 0 when it leaves the view                                                                                          |
| `WHEN.HOVER`            | 0 to 1 on pointer enter, 1 to 0 on leave           | Leave plays from the current progress. `more` sets delays and a separate way out. Touch: a tap toggles, a tap outside plays out. Focus counts as enter and blur as leave |
| `WHEN.SCROLL`           | The progress follows the element's place on screen | Scroll-linked. `duration`, `delay`, `once` and `loop` do not apply. `loop` is an error                                                                                   |
| `WHEN.MANUAL`           | Only when a controller plays it                    | No automatic trigger                                                                                                                                                     |
| A store or read store   | Truthy: 0 to 1. Falsy: 1 to 0                      | Read reactively. The first value is applied without animating                                                                                                            |

> [!IMPORTANT]
> Only `DETACH` items delay the removal of the nodes on detach. `VIEW`, `HOVER` and store items do not.

```html
<section animate={{ style: fadeUp, when: WHEN.VIEW }}>...</section>
<button animate={{ style: grow, when: WHEN.HOVER }}>Hover me</button>
<div animate={{ style: pulse, when: isOpen }}>...</div>
```

`once` on `HOVER` or a store plays forward only the first time. `VIEW` already plays once unless `more.reverse` is set.

## more

`more` holds the options of one trigger. Each trigger takes only its own keys. A key from another trigger is an error that lists the allowed keys.

| Trigger       | Key           | Type                 | Default         | Effect                                                                                                                                                                          |
| ------------- | ------------- | -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WHEN.VIEW`   | `margin`      | number or CSS length | `0`             | How far inside the screen edge the element must be before it counts as in view. A number is px. A string such as `"10%"` works too. Positive values need the element further in |
| `WHEN.VIEW`   | `amount`      | number, 0 to 1       | `0.15`          | How much of the element must be visible                                                                                                                                         |
| `WHEN.VIEW`   | `reverse`     | boolean              | `false`         | Play back out when the element leaves the view, and again on re-entry                                                                                                           |
| `WHEN.HOVER`  | `inDelay`     | ms                   | `0`             | Wait after pointer enter before playing in. Leaving inside the wait cancels it                                                                                                  |
| `WHEN.HOVER`  | `outDelay`    | ms                   | `0`             | Wait after pointer leave before playing back. Entering again inside the wait cancels it                                                                                         |
| `WHEN.HOVER`  | `out`         | keyframes            | none            | The animation for leaving. It starts from the look the element has at that moment, so nothing jumps. Without it, the in plays backward                                          |
| `WHEN.HOVER`  | `outDuration` | ms                   | item `duration` | Length of the way out. Needs `out`                                                                                                                                              |
| `WHEN.SCROLL` | `start`       | number               | `0`             | The line where the progress is 0. Fraction of the screen height, counted from the bottom edge                                                                                   |
| `WHEN.SCROLL` | `end`         | number               | `1`             | The line where the progress is 1. Same units as `start`. `0` is the bottom edge, `1` the top edge                                                                               |
| `WHEN.SCROLL` | `follow`      | store of an element  | none            | The tall element that drives the progress. Its scroll position is used instead of the item's own. Not with `start` or `end`. See [Pinned scroll](#pinned-scroll)                |
| `WHEN.SCROLL` | `part`        | `[from, to]`         | `[0, 1]`        | Plays only that slice of the progress. `[0.5, 1]` plays in the second half. Needs `0 <= from < to <= 1`                                                                         |

```html
<section animate={{ style: PRESET.SLIDE_UP, when: WHEN.VIEW, more: { margin: "10%", amount: 0.5, reverse: true } }}>...</section>
<button animate={{ style: glow, when: WHEN.HOVER, more: { outDelay: 200 } }}>Hover me</button>
<div animate={{ style: fadeOut, when: WHEN.SCROLL, more: { start: 0.2, end: 0.8 } }}>...</div>
```

> [!NOTE]
> `WHEN.VIEW` items with the same margin and amount share one observer. The observer is removed when its last item detaches.

> [!NOTE]
> `reverse` at the top level of an item is an error: `reverse moved into more: { reverse: true }`.

### SCROLL lines

| `start` / `end` | Where the element is                        |
| --------------- | ------------------------------------------- |
| `0`             | Its top is at the bottom edge of the screen |
| `0.5`           | Its top is at the middle of the screen      |
| `1`             | Its top is at the top edge of the screen    |

Progress is clamped to 0 to 1, and it is linear in the element's position. Keyframe curves still shape each segment. With reduced motion, a scroll item shows its end state (progress 1) and does not listen for scroll.

### Pinned scroll

Use `follow` to play a scene while a tall section scrolls past, with the scene held on screen. Set the section with [bind-element](events.md#bind-element). Then put the scene in a sticky box inside it:

```html
<script>
import { store, WHEN, PRESET } from "lucia";

const section = store(null);
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
- While the store is `null`, progress is 0.
- `part` plays only one slice of the progress. Two items can play one after another: `part: [0, 0.5]` and `part: [0.5, 1]`.

> [!NOTE]
> Many items can follow the same section. The section is measured once per frame, not once per item.

## Midway

A play can be asked for while another one is still running: a hover leaves mid-way, a store flips, or code calls `play()` or `reverse()`. `midway` sets what happens then.

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
<div animate={{ style: slide, when: store, midway: { turn: TURN.SMOOTH, turnDuration: 250 } }}>...</div>
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

The keyframes value is read again at the start of every play. Keyframes built from stores pick up new values.

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
| `WHEN.SCROLL` does not reload keyframes that come from stores while it runs                  | Set the keyframes before the element mounts                           |
| No stagger helper. Delays for a list are set by hand                                         | Give each item its own `delay`                                        |
| Frames are driven by JavaScript, not the compositor                                          | Keep the number of animated elements moderate. See the stress example |
| Layout properties (`width`, `top`, `margin`) are slow                                        | Animate `transform` and `opacity` where you can                       |

## Types

| Type            | Shape                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Keyframes`     | `{ default?: DefaultEasing; 0: KeyframeValue; 1: KeyframeValue } & Record<number, KeyframeValue>`                                                                               |
| `KeyframeValue` | `Style`, `[Ease, Style]`, `[EaseStyle, Style]` or `[EaseStyle, Ease, Style]`                                                                                                    |
| `DefaultEasing` | `[EaseStyle, Ease]`, `[EaseStyle]` or `[Ease]`                                                                                                                                  |
| `Style`         | The DOM style properties in camelCase (`opacity`, `backgroundColor`), with numbers or strings, and `--custom` properties                                                        |
| `AnimateItem`   | A union on `when`: `more` is typed by the trigger. For example `ViewMore` on `WHEN.VIEW`, `HoverMore` on `WHEN.HOVER`, and no `more` on `ATTACH`, `DETACH`, `MANUAL` or a store |
| `EaseStyle`     | `(t: number) => number`, such as `EASE.STYLE.QUART`                                                                                                                             |
| `Ease`          | One of `EASE.IN`, `EASE.OUT`, `EASE.INOUT`                                                                                                                                      |
| `Animate`       | `Keyframes \| AnimateItem \| (Keyframes \| AnimateItem)[]`                                                                                                                      |

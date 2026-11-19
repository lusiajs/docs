[Back to README](../README.md)

# Animate

`animate` changes CSS values over time. You write the styles for a few key points, and the framework blends between them.

```html
<script>
import { ACTIVE, EASE, TRANSITION } from "lucia";

const fadeUp = {
  0: { opacity: 0, translate: "0px 20px" },
  1: [TRANSITION.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
};

const reveal = { animation: fadeUp, active: ACTIVE.VIEW, duration: 400 };
</script>

<div animate={reveal}>Hi</div>
<p animate={{ ...reveal, delay: 150 }}>Hi, later</p>
```

Animation is the only special attribute. Everything else lives inside its value.

## The value

`animate` takes one of these:

| Form | Meaning |
|---|---|
| `Keyframes` | Plays once on attach with the defaults. Shorthand for `{ animation: it }` |
| `AnimateItem` | One animation with its own trigger and timing |
| An array | Each item plays on its own trigger |

```html
<div animate={[
  { animation: fadeIn, active: ACTIVE.VIEW, duration: 400 },
  { animation: glow, active: ACTIVE.HOVER },
]}>...</div>
```

### AnimateItem fields

| Field | Type | Default | Effect |
|---|---|---|---|
| `animation` | Keyframes | required | The keys to play |
| `transition` | `TRANSITION` member | `TRANSITION.CUBIC` | The curve for every key that sets none. See [Keyframes](#keyframes) |
| `ease` | `EASE` member | `EASE.OUT` | The ease for every key that sets none |
| `active` | `ACTIVE` member or a store | `ACTIVE.IN` | What plays it. See [Triggers](#triggers) |
| `control` | controller | none | Lets code play, reverse, stop or seek the item. See [Controller](#controller) |
| `once` | boolean | `false` (`true` for `ACTIVE.VIEW`) | Play forward only the first time. `VIEW` stays once unless `more.reverse` is set |
| `more` | object | none | Options for the trigger: `margin`, `amount` and `reverse` for `VIEW`, `inDelay`, `outDelay`, `out` and `outDuration` for `HOVER`, `start`, `end`, `follow` and `part` for `SCROLL`. See [more](#more) |
| `keep` | boolean | `true` | When `false`, the inline styles the animation wrote are removed once a play ends at progress 1 |
| `duration` | ms | `300` | Length of one play |
| `delay` | ms | `0` | Wait before each forward play |
| `loop` | boolean or count | none | `true` repeats forever, `3` repeats three times |
| `backAndForth` | boolean | `false` | With `loop`: each repeat plays 0 to 1, then 1 to 0 (one loop pass = there and back) |

Missing `animation`, an unknown `active` value and keyframes without 0 or 1 throw an error.

> [!NOTE]
> `alternate` was renamed to `backAndForth`. An item that still uses `alternate` throws `alternate was renamed to backAndForth`.

> [!NOTE]
> Items in an array are independent. If two items set the same CSS property, the later item wins for that property, and the earlier one does not write it.

An element can have one `IN` item and one `OUT` item, so it has different enter and leave animations.

## Triggers

| `active` | When it plays | Notes |
|---|---|---|
| `ACTIVE.IN` (default) | 0 to 1 once, when attached | Nothing on detach |
| `ACTIVE.OUT` | Its own keyframes, when detaching | Detach waits for it. Nothing on attach |
| `ACTIVE.VIEW` | 0 to 1 when at least 15% is visible | Once by default. `more: { reverse: true }` plays 1 to 0 when it leaves the view |
| `ACTIVE.HOVER` | 0 to 1 on pointer enter, 1 to 0 on leave | Leave plays from the current progress. `more` sets delays and a separate way out. Touch: a tap toggles, a tap outside plays out. Focus counts as enter and blur as leave |
| `ACTIVE.SCROLL` | The progress follows the element's place on screen | Scroll-linked. `duration`, `delay`, `once` and `loop` do not apply. `loop` is an error |
| `ACTIVE.MANUAL` | Only when a controller plays it | No automatic trigger |
| A store or read store | Truthy: 0 to 1. Falsy: 1 to 0 | Read reactively. The first value is applied without animating |

> [!IMPORTANT]
> Only `OUT` items delay the removal of the nodes on detach. `VIEW`, `HOVER` and store items do not.

```html
<section animate={{ animation: fadeUp, active: ACTIVE.VIEW }}>...</section>
<button animate={{ animation: grow, active: ACTIVE.HOVER }}>Hover me</button>
<div animate={{ animation: pulse, active: isOpen }}>...</div>
```

`once` on `HOVER` or a store plays forward only the first time. `VIEW` already plays once unless `more.reverse` is set.

## more

`more` holds the options of one trigger. Each trigger takes only its own keys. A key from another trigger is an error that lists the allowed keys.

| Trigger | Key | Type | Default | Effect |
|---|---|---|---|---|
| `ACTIVE.VIEW` | `margin` | number or CSS length | `0` | How far inside the screen edge the element must be before it counts as in view. A number is px. A string such as `"10%"` works too. Positive values need the element further in |
| `ACTIVE.VIEW` | `amount` | number, 0 to 1 | `0.15` | How much of the element must be visible |
| `ACTIVE.VIEW` | `reverse` | boolean | `false` | Play back out when the element leaves the view, and again on re-entry |
| `ACTIVE.HOVER` | `inDelay` | ms | `0` | Wait after pointer enter before playing in. Leaving inside the wait cancels it |
| `ACTIVE.HOVER` | `outDelay` | ms | `0` | Wait after pointer leave before playing back. Entering again inside the wait cancels it |
| `ACTIVE.HOVER` | `out` | keyframes | none | The animation for leaving. It starts from the look the element has at that moment, so nothing jumps. Without it, the in plays backward |
| `ACTIVE.HOVER` | `outDuration` | ms | item `duration` | Length of the way out. Needs `out` |
| `ACTIVE.SCROLL` | `start` | number | `0` | The line where the progress is 0. Fraction of the screen height, counted from the bottom edge |
| `ACTIVE.SCROLL` | `end` | number | `1` | The line where the progress is 1. Same units as `start`. `0` is the bottom edge, `1` the top edge |
| `ACTIVE.SCROLL` | `follow` | store of an element | none | The tall element that drives the progress. Its scroll position is used instead of the item's own. Not with `start` or `end`. See [Pinned scroll](#pinned-scroll) |
| `ACTIVE.SCROLL` | `part` | `[from, to]` | `[0, 1]` | Plays only that slice of the progress. `[0.5, 1]` plays in the second half. Needs `0 <= from < to <= 1` |

```html
<section animate={{ animation: PRESET.SLIDE_UP, active: ACTIVE.VIEW, more: { margin: "10%", amount: 0.5, reverse: true } }}>...</section>
<button animate={{ animation: glow, active: ACTIVE.HOVER, more: { outDelay: 200 } }}>Hover me</button>
<div animate={{ animation: fadeOut, active: ACTIVE.SCROLL, more: { start: 0.2, end: 0.8 } }}>...</div>
```

> [!NOTE]
> `ACTIVE.VIEW` items with the same margin and amount share one observer. The observer is removed when its last item detaches.

> [!NOTE]
> `reverse` at the top level of an item is an error: `reverse moved into more: { reverse: true }`.

### SCROLL lines

| `start` / `end` | Where the element is |
|---|---|
| `0` | Its top is at the bottom edge of the screen |
| `0.5` | Its top is at the middle of the screen |
| `1` | Its top is at the top edge of the screen |

Progress is clamped to 0 to 1, and it is linear in the element's position. Keyframe curves still shape each segment. With reduced motion, a scroll item shows its end state (progress 1) and does not listen for scroll.

### Pinned scroll

Use `follow` to play a scene while a tall section scrolls past, with the scene held on screen. Set the section with [bind-element](events.md#bind-element). Then put the scene in a sticky box inside it:

```html
<script>
import { store, ACTIVE, PRESET } from "lucia";

const section = store(null);
</script>

<section bind-element={section} style="height: 300vh">
  <div style="position: sticky; top: 0; height: 100vh">
    <h1 animate={{ animation: PRESET.FADE, active: ACTIVE.SCROLL, more: { follow: section } }}>Title</h1>
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

## Keyframes

A keyframes object maps progress keys to a step each. A key is a number from 0 to 1. 0 is the start, 1 is the end.

```ts
import type { Keyframes } from "lucia";

const fade: Keyframes = {
  0: { opacity: 0 },
  0.5: [EASE.IN, { opacity: 0.8 }],
  1: [TRANSITION.QUART, EASE.OUT, { opacity: 1 }],
};
```

| Part | Meaning |
|---|---|
| Key | Progress from 0 to 1. Must include `0` and `1`. Keys outside 0 to 1, or listed twice, throw |
| Value | One of the four key forms below |
| `style` | CSS properties, in camelCase or kebab-case |

### Key forms

| Form | Example | Curve used |
|---|---|---|
| Style object | `{ opacity: 0 }` | The item's `transition` and `ease` |
| `[transition, ease, style]` | `[TRANSITION.QUART, EASE.OUT, { opacity: 1 }]` | The ones written |
| `[transition, style]` | `[TRANSITION.QUART, { opacity: 1 }]` | The written transition, the item's ease |
| `[ease, style]` | `[EASE.IN, { opacity: 1 }]` | The item's transition, the written ease |

A transition is a function, and an ease is an `EASE` member, so the two are told apart by their type. Any other shape throws.

The keyframes value is read again at the start of every play. Keyframes built from stores pick up new values.

### Defaults for an item

Set `transition` and `ease` on the item to change the curve for every key that does not set its own.

```html
<div animate={{ animation: fade, transition: TRANSITION.EXPO, ease: EASE.INOUT }}>...</div>
```

| Field | Library default |
|---|---|
| `transition` | `TRANSITION.CUBIC` |
| `ease` | `EASE.OUT` |

### Transition and ease belong to the segment that ends at the key

A segment is the stretch between two keys. Its transition and ease come from the key where it ends.

```
key 0 ---- uses key 0.5's transition and ease ----> key 0.5 ---- uses key 1's transition and ease ----> key 1
```

Key 0 has no segment that ends at it, so its transition and ease are not used going forward.

A reverse play runs each segment backward with the same curve, so the motion looks the same, only backward.

## TRANSITION

`TRANSITION` holds the easing curves. Each member is a function `(t) => number` that goes from 0 at `t = 0` to 1 at `t = 1`.

| Member | Curve | Use |
|---|---|---|
| `LINEAR` | Constant speed | Motion that should not speed up |
| `QUAD` | Gentle curve | Small moves |
| `CUBIC` | Stronger curve | Most UI motion |
| `QUART` | Strong curve | Large moves |
| `QUINT` | Very strong curve | Dramatic entrances |
| `SINE` | Soft curve | Fades and small moves |
| `EXPO` | Very fast start, long settle | Snappy reveals |
| `CIRC` | Round curve | Arcs |
| `BACK` | Pulls back, then overshoots | Playful motion |
| `ELASTIC` | Springs around the end | Springy motion |
| `BOUNCE` | Bounces like a ball | Drops and landings |

### Your own curve

Any function of the same shape works in the first slot. No registration is needed.

```ts
const SOFT = (t: number) => t * t;

const slide = {
  0: { translate: "-20px 0px" },
  1: [SOFT, EASE.OUT, { translate: "0px 0px" }],
};
```

## EASE

`EASE` decides how a segment plays its curve.

| Member | Shape | Feel |
|---|---|---|
| `EASE.IN` | The curve as it is | Starts slow, ends fast |
| `EASE.OUT` | The curve flipped | Starts fast, ends slow |
| `EASE.INOUT` | Slow at both ends | Slow start, fast middle, slow end |

> [!TIP]
> `EASE.OUT` suits most entrances. `BACK`, `ELASTIC` and `BOUNCE` show their effect best with `EASE.OUT`.

## Values

| Value | Example | How it moves |
|---|---|---|
| Number | `opacity: 0` | Blends in a straight line |
| Text with numbers and units | `"10px 0px"` | Each number blends, the text around it stays |
| Zero without a unit | `"0 0"` to `"0 20px"` | The 0 takes the unit of the other side, so it tweens |
| Color | `"#e11d48"`, `"rgb(0 0 0 / 50%)"`, `"hsl(200 80% 50%)"`, `"red"` | Blends red, green, blue and alpha |
| CSS variable | `"var(--accent)"` | Resolved on the animated element, so scoped variables work |
| Different shapes | `"10px"` to `"auto"` | No blend. Switches at the middle |

- A property missing from a key takes the value of the nearest key that sets it.
- Named colors and `hsl()` are read from the browser once per play, not on every frame.

## Controller

A controller plays items by hand. Use it with `ACTIVE.MANUAL`, or with any trigger.

```ts
import { ACTIVE, controller } from "lucia";

const ctl = controller();
```

```html
<div animate={{ animation: pop, active: ACTIVE.MANUAL, control: ctl }}>...</div>
```

| Method | What it does |
|---|---|
| `ctl.play()` | Plays 0 to 1. Returns a promise that resolves when the play ends |
| `ctl.reverse()` | Plays 1 to 0. Returns a promise that resolves when the play ends |
| `ctl.stop()` | Ends the play where it is |
| `ctl.seek(progress)` | Jumps to a progress from 0 to 1 |

One controller can drive several items and elements.

## PRESET

`PRESET` holds ready-made keyframes. Use one as the animation, or as a base to change.

```html
<script>
import { ACTIVE, PRESET } from "lucia";
</script>

<div animate={PRESET.FADE}>Plays once on attach</div>
<section animate={{ animation: PRESET.SLIDE_UP, active: ACTIVE.VIEW, duration: 500 }}>...</section>
```

| Member | Effect |
|---|---|
| `FADE` | Fades in from transparent |
| `SLIDE_UP` | Comes up from below: moves up 24px into place while fading in |
| `SLIDE_DOWN` | Comes down from above: moves down 24px into place while fading in |
| `SLIDE_LEFT` | Comes in from the left: moves right 24px into place while fading in |
| `SLIDE_RIGHT` | Comes in from the right: moves left 24px into place while fading in |
| `POP` | Grows from 80% size while fading in |
| `ZOOM` | Grows from nothing to full size |
| `SHAKE` | Shakes sideways 10px, then settles |
| `PULSE` | Grows to 110% and back |
| `SPIN` | One full turn |
| `FLIP` | Turns into view around the vertical axis while fading in |

Presets use `translate`, `scale` and `rotate`, not `transform`. They combine with the element's own `transform`. Their keys set only styles, so the item's `transition` and `ease` apply to them.

> [!TIP]
> To change a preset, spread it and replace the keys you need: `{ ...PRESET.FADE, 1: { opacity: 0.5 } }`.

## Overriding patterns

| Need | Pattern |
|---|---|
| A variant of a keyframes object | Spread it and replace one key: `{ ...fadeUp, 1: [TRANSITION.QUART, EASE.OUT, { opacity: 0.5 }] }` |
| Many similar animations | A function that returns the keyframes: `animate={fadeUp(20)}` |
| One item with other timing | Use the item form: `{ animation: fadeUp, duration: 600 }` |

```ts
function fadeUp(distance: number): Keyframes {
  return {
    0: { opacity: 0, translate: `0px ${distance}px` },
    1: [TRANSITION.QUART, EASE.OUT, { opacity: 1, translate: "0px 0px" }],
  };
}
```

## Leave

`detach()` returns a promise. It resolves when the `OUT` animations have finished and the nodes are removed.

```ts
const card = attach(Card, slot);
await card.detach(); // the nodes are gone when this resolves
```

| Case | Result |
|---|---|
| No `OUT` items | Nodes are removed at once, and the promise resolves at once |
| `OUT` starts while an `IN` is still running | It plays its own keyframes from the current style |
| A child component has `OUT` items | The parent waits for them too |

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

| Limit | What to do |
|---|---|
| No `auto` sizes. `height: auto` cannot tween | Animate a fixed value, or animate `scale` instead |
| Touch has no hover. `ACTIVE.HOVER` uses taps there: a tap toggles, and a tap outside plays out | For content that should play on scroll, use `ACTIVE.VIEW` |
| `ACTIVE.SCROLL` does not reload keyframes that come from stores while it runs | Set the keyframes before the element mounts |
| No stagger helper. Delays for a list are set by hand | Give each item its own `delay` |
| Frames are driven by JavaScript, not the compositor | Keep the number of animated elements moderate. See the stress example |
| Layout properties (`width`, `top`, `margin`) are slow | Animate `transform` and `opacity` where you can |

## Types

| Type | Shape |
|---|---|
| `Keyframes` | `Record<number, [Transition, Ease, Style]>` |
| `AnimateItem` | `{ animation, transition?, ease?, active?, control?, once?, more?, keep?, duration?, delay?, loop?, backAndForth? }` |
| `Transition` | `(t: number) => number`, such as `TRANSITION.QUART` |
| `Ease` | One of `EASE.IN`, `EASE.OUT`, `EASE.INOUT` |
| `Animate` | `Keyframes \| AnimateItem \| (Keyframes \| AnimateItem)[]` |

import type { PlayFile } from "../types.ts";
import { animations } from "./animations.ts";
import { blank } from "./blank.ts";
import { components } from "./components.ts";
import { counter } from "./counter.ts";
import { forms } from "./forms.ts";
import { scopedStyles } from "./scoped-styles.ts";
import { scroll } from "./scroll.ts";
import { todo } from "./todo.ts";

export interface Preset {
  id: string;
  title: string;
  description: string;
  files: PlayFile[];
}

export const PRESETS: readonly Preset[] = [
  blank,
  counter,
  todo,
  animations,
  scroll,
  components,
  scopedStyles,
  forms,
];

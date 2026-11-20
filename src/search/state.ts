import { variable } from "lusia";

// Whether the palette is open. The topbar box, the backdrop and the shortcuts all read this one variable.
export const searchOpen = variable(false);

export function openSearch(): void {
  searchOpen.value = true;
}

export function closeSearch(): void {
  searchOpen.value = false;
}

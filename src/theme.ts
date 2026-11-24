import { variable } from "lusiajs";

export type Theme = "light" | "dark";

const storageKey = "lusia-web-theme";

// The head script in index.html sets data-theme before first paint.
export const theme = variable<Theme>(
  document.documentElement.dataset.theme === "dark" ? "dark" : "light",
);

export function setTheme(next: Theme): void {
  theme.value = next;
  document.documentElement.dataset.theme = next;
  saveTheme(next);
}

export function toggleTheme(): void {
  setTheme(theme.value === "light" ? "dark" : "light");
}

function saveTheme(value: Theme): void {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // Storage can be blocked. The theme still changes for this visit.
  }
}

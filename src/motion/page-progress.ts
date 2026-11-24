// Writes the share of the page scrolled (0 at top, 1 at bottom) as --page-progress.
// CSS reads it, so every Home layer moves from one value.
export function watchPageProgress(): () => void {
  const root = document.documentElement;
  const update = () => {
    const range = root.scrollHeight - window.innerHeight;
    const share = range > 0 ? window.scrollY / range : 0;
    root.style.setProperty("--page-progress", String(share));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

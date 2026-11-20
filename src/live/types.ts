/** A problem to show under a preview. Compile errors have a file and a position. Runtime errors have neither. */
export interface LiveError {
  message: string;
  code?: string;
  hint?: string;
  file?: string;
  line?: number;
  column?: number;
  /** Plain text lines of the source around `line`, with a caret under the error. */
  frame?: string;
}

/** What a build hands to the preview. Module names are file names. */
export interface LiveBundle {
  /** Module names to mount, in order. */
  entries: string[];
  /** Plain JavaScript by module name. Imports between files already use the module names. */
  modules: Record<string, string>;
  /** CSS the frame adds before it mounts. Empty when the frame keeps its own look. */
  styles: string;
}

/** The outcome of showing a bundle. */
export type LiveRun = { ok: true } | { ok: false; error: LiveError };

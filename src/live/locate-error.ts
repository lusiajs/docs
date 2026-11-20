import { plainFrame } from "@compiler/errors/frame.ts";
import type { LiveError } from "./types.ts";

// A dev runtime error ends its message with its location, such as "(Card.lucia:3:9)".
const LOCATION = / \(([^()]+):(\d+):(\d+)\)$/;

/** Moves a runtime error's location out of its message, and adds the code frame of that line from the file. */
export function locateRuntimeError(
  error: LiveError,
  files: readonly { name: string; code: string }[],
): LiveError {
  const match = LOCATION.exec(error.message);
  if (!match) return error;
  const [, file = "", lineText = "", columnText = ""] = match;
  const line = Number(lineText);
  const column = Number(columnText);
  const source = files.find((item) => item.name === file)?.code;
  return {
    ...error,
    message: error.message.slice(0, match.index),
    file,
    line,
    column,
    frame: source === undefined ? undefined : plainFrame(source, line, column),
  };
}

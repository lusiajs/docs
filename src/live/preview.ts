import type { LiveBundle, LiveError } from "./types.ts";

const FRAME_URL = "/playground/frame.html";
const START_LIMIT_MS = 8000;

/** What the frame needs to run a bundle: the bundle, the runtime's source and the theme. */
export interface RunPayload extends LiveBundle {
  /** The runtime module's source, which the frame loads under the name "lusiajs". */
  runtime: string;
  theme?: string;
}

interface FrameMessage {
  type: string;
  message?: string;
  code?: string;
  hint?: string;
  height?: number;
}

/** A run that failed in its frame. `detail` is what the error note shows. */
export class RunError extends Error {
  constructor(readonly detail: LiveError) {
    super(detail.message);
    this.name = "RunError";
  }
}

interface Pending {
  frame: HTMLIFrameElement;
  run: RunPayload;
  resolve: () => void;
  reject: (error: Error) => void;
  timer: number;
}

export interface PreviewOptions {
  /** Sets the frame's height to its content. Otherwise the frame fills its stage. */
  sizeToContent?: boolean;
}

/**
 * Each run starts in a new sandboxed frame. The frame stays hidden until it mounts,
 * so a run that fails leaves the last good preview on screen.
 */
export class Preview {
  private shown: HTMLIFrameElement | undefined;
  private pending: Pending | undefined;
  private readonly stage: HTMLElement;
  private readonly onRuntimeError: (error: LiveError) => void;
  private readonly sizeToContent: boolean;

  constructor(
    stage: HTMLElement,
    onRuntimeError: (error: LiveError) => void,
    options: PreviewOptions = {},
  ) {
    this.stage = stage;
    this.onRuntimeError = onRuntimeError;
    this.sizeToContent = options.sizeToContent ?? false;
    window.addEventListener("message", this.receive);
  }

  /** Resolves when the new frame has mounted. Rejects when it fails or a newer run replaces it. */
  show(run: RunPayload): Promise<void> {
    this.dropPending(new Error("A newer run replaced this one."));
    const frame = createFrame();
    this.stage.append(frame);
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(
        () =>
          this.fail(frame, {
            message: "The preview did not start.",
          }),
        START_LIMIT_MS,
      );
      this.pending = { frame, run, resolve, reject, timer };
    });
  }

  /** Removes the shown frame and any frame still loading. */
  clear(): void {
    this.dropPending(new Error("The preview was cleared."));
    this.shown?.remove();
    this.shown = undefined;
  }

  destroy(): void {
    window.removeEventListener("message", this.receive);
    this.clear();
  }

  private readonly receive = (event: MessageEvent<unknown>): void => {
    if (!isFrameMessage(event.data)) return;
    const pending = this.pending;
    if (pending && event.source === pending.frame.contentWindow) {
      this.onPending(pending, event.data);
    } else if (this.shown && event.source === this.shown.contentWindow) {
      this.onShown(this.shown, event.data);
    }
  };

  private onPending(pending: Pending, message: FrameMessage): void {
    if (message.type === "ready") {
      pending.frame.contentWindow?.postMessage({ type: "run", ...pending.run }, "*");
    } else if (message.type === "mounted") {
      this.promote(pending);
    } else if (message.type === "error") {
      this.fail(pending.frame, errorOf(message));
    } else if (message.type === "size") {
      this.resize(pending.frame, message);
    }
  }

  private onShown(frame: HTMLIFrameElement, message: FrameMessage): void {
    if (message.type === "error") this.onRuntimeError(errorOf(message));
    else if (message.type === "size") this.resize(frame, message);
  }

  private resize(frame: HTMLIFrameElement, message: FrameMessage): void {
    if (this.sizeToContent && message.height !== undefined) {
      frame.style.height = `${message.height}px`;
    }
  }

  private promote(pending: Pending): void {
    window.clearTimeout(pending.timer);
    this.pending = undefined;
    this.shown?.remove();
    pending.frame.classList.remove("is-pending");
    this.shown = pending.frame;
    pending.resolve();
  }

  private fail(frame: HTMLIFrameElement, detail: LiveError): void {
    const pending = this.pending;
    if (!pending || pending.frame !== frame) return;
    this.dropPending(new RunError(detail));
  }

  private dropPending(error: Error): void {
    const pending = this.pending;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    this.pending = undefined;
    pending.frame.remove();
    pending.reject(error);
  }
}

function errorOf(message: FrameMessage): LiveError {
  return {
    message: message.message ?? "Unknown error",
    code: message.code,
    hint: message.hint,
  };
}

function createFrame(): HTMLIFrameElement {
  const frame = document.createElement("iframe");
  frame.className = "preview-frame is-pending";
  frame.title = "Preview";
  frame.setAttribute("sandbox", "allow-scripts");
  frame.src = FRAME_URL;
  return frame;
}

function isFrameMessage(value: unknown): value is FrameMessage {
  return (
    typeof value === "object" && value !== null && typeof (value as FrameMessage).type === "string"
  );
}

// Written by scripts/playground-runtime.ts before dev and build.
const RUNTIME_URL = "/playground/lucia.js";

let loading: Promise<string> | undefined;

/** The runtime's source for the preview frame. It is fetched once per visit. */
export function loadRuntime(): Promise<string> {
  loading ??= fetch(RUNTIME_URL)
    .then(readText)
    .catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
  return loading;
}

async function readText(response: Response): Promise<string> {
  if (!response.ok) throw new Error("The preview runtime could not load. Reload the page.");
  return response.text();
}

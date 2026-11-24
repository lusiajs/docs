// Messages a browser gives when a lazy chunk is missing, which happens after a deploy renamed it.
const STALE_CHUNK_PATTERN =
  /dynamically imported module|Importing a module script failed|MIME type|Failed to fetch|Loading chunk/i;

export function isStaleChunkError(error: unknown): boolean {
  return error instanceof Error && STALE_CHUNK_PATTERN.test(error.message);
}

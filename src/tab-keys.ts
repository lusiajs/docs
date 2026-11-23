// The tab that an arrow, Home or End key moves to. Null for any other key.
export function nextIndex(key: string, current: number, count: number): number | null {
	if (key === "ArrowRight") return (current + 1) % count;
	if (key === "ArrowLeft") return (current - 1 + count) % count;
	if (key === "Home") return 0;
	if (key === "End") return count - 1;
	return null;
}

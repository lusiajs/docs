const HOLD_FRAMES = 22;

// The frames that type one text out, with no hold and no erase.
export function typeOnceFrames(text: string): string[] {
	return typingFrames([text]).slice(0, text.length);
}

// Every text the typing effect shows, in order: type, hold, erase, then the next phrase.
export function typingFrames(phrases: string[]): string[] {
	const frames: string[] = [];
	for (const phrase of phrases) {
		for (let length = 1; length <= phrase.length; length++) {
			frames.push(phrase.slice(0, length));
		}
		for (let hold = 0; hold < HOLD_FRAMES; hold++) frames.push(phrase);
		for (let length = phrase.length - 1; length >= 0; length--) {
			frames.push(phrase.slice(0, length));
		}
	}
	return frames;
}

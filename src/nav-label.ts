// A zero-width space after "=" lets a long sidebar name wrap there, so "bind-value=" stays on one line.
export function navLabel(name: string): string {
	return name.replaceAll("=", "=​");
}

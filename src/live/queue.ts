/** Runs tasks one after another. A task starts once the task before it has finished, even if that one failed. */
export function createQueue(): (task: () => unknown) => Promise<unknown> {
	let tail: Promise<unknown> = Promise.resolve();
	return (task) => {
		tail = tail.then(task).catch((error: unknown) => console.error(error));
		return tail;
	};
}

/** Runs tasks one after another. A task starts once the task before it has finished. */
export function createQueue(): (task: () => unknown) => void {
  let tail: Promise<unknown> = Promise.resolve();
  return (task) => {
    tail = tail.then(task);
  };
}

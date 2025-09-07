type Task<T> = () => Promise<T>;

export async function promiseLimit<T>(tasks: Task<T>[], limit = 5) {
  const promises = new Set();
  for (const task of tasks) {
    if (promises.size >= limit) {
      await Promise.race(promises);
    }
    const p = task();
    promises.add(p);
    p.then(() => promises.delete(p));
  }
  await Promise.all(promises);
}

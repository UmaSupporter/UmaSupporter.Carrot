export function chain<T extends Function>(array: string[], requester: T, ...args: any[]) {
  return array.reduce(async (promise, item) => {
    try {
      await promise;
      return requester(item, ...args);
    } catch {
      throw item;
    }
  }, Promise.resolve());
}

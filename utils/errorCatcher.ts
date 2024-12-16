async function errorCatcher<T>(
  promise: Promise<T>,
): Promise<[Error] | [undefined, T]> {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (error) {
    return [error as Error];
  }
}

export default errorCatcher;

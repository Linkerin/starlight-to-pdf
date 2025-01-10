function approximateSleep(ms: number) {
  return new Promise((resolve, reject) => {
    if (typeof ms !== 'number' || ms < 0) {
      reject(
        new Error(
          `Invalid time specified for \`sleep()\`. "ms" must be a non-negative number, got ${ms}.`
        )
      );
      return;
    }

    return setTimeout(resolve, ms);
  });
}
export default approximateSleep;

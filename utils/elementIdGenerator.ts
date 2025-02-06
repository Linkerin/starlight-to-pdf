/**
 * Generates a sequence of unique element IDs with a given prefix.
 *
 * The generated IDs have the format `*{prefix}-{index}*`, where `{prefix}` is the
 * provided prefix and `{index}` is an incrementing number starting from 0.
 *
 * @param prefix - The prefix to use for the generated IDs.
 * @returns A generator that yields the next unique ID in the sequence.
 * @throws {TypeError} If the `prefix` parameter is not provided.
 */
function* elementIdGenerator(prefix: string): Generator<string> {
  if (!prefix) {
    throw new TypeError('elementIdGenerator: `prefix` is required');
  }

  let index = 0;

  while (true) {
    yield `*${prefix}-${index++}*`;
  }
}

export default elementIdGenerator;

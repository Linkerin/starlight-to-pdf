import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    version: {
      type: "boolean",
      short: "V",
    },
    url: {
      type: "string",
      short: "U",
    },
  },
  strict: true,
  allowPositionals: true,
});

export default {
  currentPath: positionals.at(1),
  values,
};

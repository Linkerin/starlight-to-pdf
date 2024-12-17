import { resolve } from "path";
import { readFile } from "fs/promises";

import errorCatcher from "./errorCatcher";
import logger from "./logger";

export async function getVersion(): Promise<string | null> {
  const packagePath = resolve(__dirname, "../package.json");
  const [error, file] = await errorCatcher(
    readFile(packagePath, { encoding: "utf8" }),
  );
  if (error) return null;

  const contents = JSON.parse(file);
  if (!contents.version) return null;

  return contents.version;
}

export async function showVersion(): Promise<void> {
  const version = await getVersion();

  if (!version) {
    logger.error("Could not find version info");
    return;
  }

  logger.info(`v${version}`);
  return;
}

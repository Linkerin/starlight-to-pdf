import logger from "./logger";

export async function getVersion(): Promise<string | null> {
  const file = Bun.file("./package.json");
  const contents = await file.json();

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

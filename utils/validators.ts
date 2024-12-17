import type { PaperFormat } from "puppeteer";
import { sep } from "path";

import { basePaperFormats, PAPER_FORMATS } from "../lib/constants";
import logger from "./logger";

const invalidChars = /[<>:"|?*]/; // Windows-specific characters
const illegalNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i; // Windows reserved names

export function isBoolean(value: unknown, key: string): value is boolean {
  if (typeof value !== "boolean") {
    logger.error(`\`--${key}\` is a boolean argument.`);
    return false;
  }

  return true;
}

function isString(value: unknown, key: string): value is string {
  if (typeof value !== "string") {
    logger.error(`For \`--${key}\` argument value must be a string.`);
    return false;
  }

  return true;
}

export function isFilename(name: unknown, key: string): name is string {
  if (!isString(name, key)) return false;

  if (name.trim() === "") {
    logger.error(`\`--${key}\` argument value must be a non-empty string.`);
    return false;
  }

  if (invalidChars.test(name) || illegalNames.test(name)) {
    logger.error(`Invalid \`--${key}\` value. Provided: ${name} `);
    return false;
  }

  return true;
}

export function isFormat(format: unknown, key: string): format is PaperFormat {
  if (!isString(format, key)) return false;

  if (!PAPER_FORMATS.has(format)) {
    logger.error(`Invalid format value provided: '${format}'.`);
    logger.error(`Allowed values: '${basePaperFormats.join("', '")}'.`);

    return false;
  }

  return true;
}

export function isPath(value: unknown, key: string): boolean {
  if (!isString(value, key)) return false;

  if (value.trim() === "") {
    logger.error(`\`--${key}\` argument value must be a non-empty string.`);
    return false;
  }

  const pathParts = value.split(sep);

  for (const part of pathParts) {
    if (invalidChars.test(part) || illegalNames.test(part)) {
      logger.error(`\`--${key}\` value contains invalid part: ${part}`);
      return false;
    }
  }

  // Ensures the path doesn't have null bytes
  if (value.includes("\0")) {
    logger.error(`\`--${key}\` value contains null byte.`);
    return false;
  }

  return true;
}

export function isSpacing(values: unknown, key: string): boolean {
  if (!isString(values, key)) return false;

  const spacingValues = values.split(" ");
  if (spacingValues.length !== 4) {
    logger.error(
      `For \`--${key}\` argument must be four values separated by spaces.`,
    );

    return false;
  }

  const spacingRegex = /^\d+(\.\d+)?(mm|in|cm|px|pt|pc)?$/;
  for (const spacing of spacingValues) {
    if (!spacing.match(spacingRegex)) {
      logger.error(`Invalid margin value provided: '${spacing}'.`);

      return false;
    }
  }

  return true;
}

export function isUrl(value: unknown, key: string): boolean {
  if (!isString(value, key)) return false;

  const urlRegex =
    /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(localhost)|(\d{1,3}(\.\d{1,3}){3}))(:\d+)?(\/[^\s]*)?$/;

  if (!value.match(urlRegex)) {
    logger.error(`Invalid URL provided: '${value}'.`);
    return false;
  }

  return true;
}

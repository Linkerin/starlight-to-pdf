import { parseArgs } from "util";

import {
  isBoolean,
  isFilename,
  isFormat,
  isPath,
  isSpacing,
  isString,
  isUrl,
} from "./validators";
import logger from "./logger";

class CliArgs {
  private _values;
  private _positionals;
  private _url;

  constructor() {
    const { values, positionals } = parseArgs({
      args: Bun.argv,
      options: {
        url: {
          type: "string",
          short: "u",
        },
        "contents-name": {
          type: "string",
        },
        filename: {
          type: "string",
          short: "f",
        },
        format: {
          type: "string",
        },
        help: {
          type: "boolean",
          short: "h",
        },
        margins: {
          type: "string",
          short: "m",
        },
        "no-contents": {
          type: "boolean",
        },
        paddings: {
          type: "string",
        },
        path: {
          type: "string",
          short: "p",
        },
        "print-bg": {
          type: "boolean",
        },
        version: {
          type: "boolean",
          short: "V",
        },
      },
      strict: true,
      allowPositionals: true,
    });

    this._values = values;
    this._positionals = positionals;

    const checkRes = this.isValidArgs();
    if (!checkRes) {
      logger.error("Programm exits due to invalid arguments.");
      process.exit(1);
    }

    this._url = this._values.url ?? this._positionals.at(2);
  }

  get values() {
    return this._values;
  }

  get positionals() {
    return this._positionals;
  }

  get url() {
    return this._url;
  }

  isValidArgs() {
    if (this._positionals.length > 3) {
      logger.error("Too many positional arguments provided.");
      return false;
    }

    const positionalUrl = this._positionals.at(2);
    if (positionalUrl && !isUrl(positionalUrl, "url")) return false;

    let result = true;

    for (const [key, value] of Object.entries(this._values)) {
      switch (key as keyof typeof this._values) {
        case "url":
          result = isUrl(value, key);
          break;

        case "contents-name":
          result = isString(value, key);
          break;

        case "filename":
          result = isFilename(value, key);
          break;

        case "format": {
          result = isFormat(value, key);
          break;
        }

        case "help":
          result = isBoolean(value, key);
          break;

        case "margins":
          result = isSpacing(value, key);
          break;

        case "no-contents":
          result = isBoolean(value, key);
          break;

        case "paddings":
          result = isSpacing(value, key);
          break;

        case "path":
          result = isPath(value, key);
          break;

        case "print-bg":
          result = isBoolean(value, key);
          break;

        case "version":
          result = isBoolean(value, key);
          break;

        default:
          throw new Error(`Unknown argument: ${key}`);
      }

      if (!result) break;
    }

    return result;
  }
}

export default CliArgs;

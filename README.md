# starlight-to-pdf

[![npm version](https://img.shields.io/npm/v/starlight-to-pdf?style=for-the-badge&logo=npm&color=0B936A)](https://www.npmjs.com/package/starlight-to-pdf?activeTab=versions)
[![npm](https://img.shields.io/npm/dw/starlight-to-pdf?style=for-the-badge&logo=npm&label=NPM)](https://www.npmjs.com/package/starlight-to-pdf?activeTab=readme)
[![MIT License](https://img.shields.io/badge/License-MIT-%23A31F34?style=for-the-badge)](https://github.com/Linkerin/starlight-to-pdf/blob/main/LICENSE)
[![TS Support](https://img.shields.io/github/languages/top/Linkerin/starlight-to-pdf?style=for-the-badge&logo=typescript)](https://github.com/search?q=repo%3ALinkerin%2Fstarlight-to-pdf++language%3ATypeScript&type=code)

![starlight to pdf banner image](./readme_assets/starlight-to-pdf.svg)

## 📖 Description <a id="description"></a>

A command-line tool for converting documentation websites built with
🌟[Starlight](https://starlight.astro.build) into PDF files.

> The project has recently started and is still in development. Feel free to
> open an issue if you have any questions or suggestions. We would also
> appreciate any contributions.

## ⌨️ Example usage <a id="usage"></a>

Get started quickly with a single command:

```bash
npx starlight-to-pdf https://starlight.astro.build
```

> Note: Ensure you have [Node.js](https://nodejs.org) (v16 or higher) installed
> on your machine.

URL is the only positional and required argument. You can also provide a URL
using the `--url` (or `-u`) flag.

## 👨‍💻 CLI Flags Reference <a id="flags"></a>

| Flag              | Short | Type      | Description                                                                                                                                                                                                               |
| ----------------- | ----- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--url`           | `-u`  | `string`  | The URL of the Starlight powered documentation website to convert to PDF. The only positional argument can be used instead of this flag. See [👨‍💻 Example usage](#usage) for more details.                                 |
| `--contents-name` |       | `string`  | The name used for the generated table of contents in the PDF. By default, it's `"Contents"`                                                                                                                               |
| `--exclude`       | `-e`  | `string`  | A string containing links separated by `space` that shouldn't be added to the resulting PDF file (e.g. `--exclude '/docs/contacts /docs/demo'`). You may also provide multiple values: `-e /docs/contacts -e /docs/demo`. |
| `--filename`      | `-f`  | `string`  | The output filename for the generated PDF. Default is the [hostname](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname) of the provided website.                                                              |
| `--format`        |       | `string`  | The paper format (e.g., `A4`, `Letter`) for the generated PDF. Check [Puppeteer's paper formats](https://pptr.dev/api/puppeteer.paperformat) for more details                                                             |
| `--help`          | `-h`  | `boolean` | Displays the help message and exits.                                                                                                                                                                                      |
| `--margins`       |       | `string`  | Sets margins for the PDF file. They must be provided as a string with 4 values separates by `space`, reflecting the top, right, bottom and left margins respectively. Default value is `'1cm 1cm 1cm 1.5cm'`.             |
| `--no-contents`   |       | `boolean` | Disables the table of contents in the generated PDF.                                                                                                                                                                      |
| `--paddings`      |       | `string`  | Sets padding for the PDF content. They must be provided as a string with 4 values separates by `space`, reflecting the top, right, bottom and left paddings respectively. Paddings are disabled by default.               |
| `--path`          | `-p`  | `string`  | The directory path where the PDF will be saved. Default value is the current working directory.                                                                                                                           |
| `--pdf-outline`   |       | `boolean` | Generates an outline for the PDF file on the side. It's an `outline` property in [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions).                                                                     |
| `--print-bg`      |       | `boolean` | Set to print background graphics. It's a `printBackground` property in [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions/).                                                                              |
| `--timeout`       |       | `string`  | Timeout for both the page actions and `protocolTimeout` in milliseconds. You may need to increase this value for parsing large websites. The default value is `180_000` (2 minutes).                                      |
| `--version`       | `-v`  | `boolean` | Displays the version of the tool and exits.                                                                                                                                                                               |

Usage example:

```bash
npx starlight-to-pdf spectrum.snipshot.dev -p ./output --filename spectrum-docs --contents-name "Table of contents" --margins '0 0 0 0' --paddings '1cm 1cm 1cm 1.5cm' --exclude /demo  --print-bg
```

Resulting PDF file: [spectrum-docs.pdf](./readme_assets/spectrum-docs.pdf)

### Demo

![Usage demo](./readme_assets/demo.gif)

## 📨 Contacts <a id="contacts"></a>

If you want to get in touch, you may open a
[GitHub issue](https://github.com/Linkerin/starlight-to-pdf/issues) or send me
an email at: [gusev@snipshot.dev](mailto:gusev@snipshot.dev).

## 🪪 License <a id="license"></a>

**starlight-to-pdf** is licensed under the MIT License. See the
[LICENSE](https://github.com/Linkerin/starlight-to-pdf/blob/main/LICENSE) file
for details.

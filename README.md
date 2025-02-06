# starlight-to-pdf

[![npm version](https://img.shields.io/npm/v/starlight-to-pdf?style=for-the-badge&logo=npm&color=0B936A)](https://www.npmjs.com/package/starlight-to-pdf?activeTab=versions)
[![npm](https://img.shields.io/npm/dw/starlight-to-pdf?style=for-the-badge&logo=npm&label=NPM)](https://www.npmjs.com/package/starlight-to-pdf?activeTab=readme)
[![MIT License](https://img.shields.io/badge/License-MIT-%23A31F34?style=for-the-badge)](https://github.com/Linkerin/starlight-to-pdf/blob/main/LICENSE)
[![Github stars count](https://img.shields.io/github/stars/Linkerin/starlight-to-pdf?style=for-the-badge&logo=github&label=stars&color=EEB51C)](https://github.com/Linkerin/starlight-to-pdf/stargazers)

[![starlight to pdf banner image](./readme_assets/starlight-to-pdf.svg)](#starlight-to-pdf)

- [Description](#description)
- [⌨️ Getting started](#start)
- [👨‍💻 CLI Flags Reference](#flags)
  - [Usage example](#usage)
  - [Special CSS classes](#classes)
  - [PDF header and footer](#header-footer)
  - [Demo](#demo)
- [🤖 GitHub Actions](#actions)
  - [Deploying with Netlify](#netlify)
  - [Generating PDF locally](#generate-local)
- [📨 Contacts](#contacts)
- [🪪 License](#license)

## 📖 Description <a id="description"></a>

A command-line tool for converting documentation websites built with
🌟[Starlight](https://starlight.astro.build) into PDF files.

> Have questions or suggestions? Feel free to open an
> [issue](https://github.com/Linkerin/starlight-to-pdf/issues). Contributions
> are always welcome!

If you are interested in the development process, check out the
[Transforming Starlight into PDF: experience and insights](https://dev.to/linkerin/transforming-starlight-into-pdf-experience-and-insights-j1d)
article.

## ⌨️ Getting started <a id="start"></a>

Convert your Starlight documentation into a PDF file with a single command:

```bash
npx starlight-to-pdf https://starlight.astro.build
```

> Note: Ensure you have [Node.js](https://nodejs.org) (v18 or higher) and Chrome
> browser installed on your machine.

URL is the only positional and required argument. Alternatively, you can use the
`--url` (or `-u`) flag to specify it.

## 👨‍💻 CLI Flags Reference <a id="flags"></a>

| Flag                       | Short | Type                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ----- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--url`                    | `-u`  | `string`                   | The URL of the Starlight powered documentation website to convert to PDF. The only positional argument can be used instead of this flag. See [⌨️ Getting started](#start) for details.                                                                                                                                                                                                                                                                                           |
| `--browser-executable`     |       | `string`                   | Specifies a path to a browser executable to use instead of the default one (e.g. `--browser-executable /usr/bin/chromium-browser`).                                                                                                                                                                                                                                                                                                                                              |
| `--contents-name`          |       | `string`                   | Customizes the generated table of contents name in the PDF. Default: `"Contents"`                                                                                                                                                                                                                                                                                                                                                                                                |
| `--contents-links`         |       | `'internal' \| 'external'` | Specifies the type of links in the generated table of contents. Use `'internal'` for links that navigate within the PDF file or `'external'` for links that point to the documentation website. Default: `'external'`                                                                                                                                                                                                                                                            |
| `--css-page-size`          |       | `boolean`                  | Allows setting the PDF page size using CSS `@page`. If the predefined sizes in the `--format` option don't meet your needs, enable this option and specify the desired page size in custom CSS provided via the `--styles` flag (e.g., `@page { size: 8.5in 14in; }`). Note: if you define a page size in CSS without enabling this option, the size from the `--format` option will be used instead, and the content will be scaled to fit the dimensions specified in `@page`. |
| `--exclude`                | `-e`  | `string`                   | A string containing links separated by `space` that shouldn't be added to the resulting PDF file (e.g. `--exclude '/docs/contacts /docs/demo'`). You may also provide multiple values: `-e /docs/contacts -e /docs/demo`.                                                                                                                                                                                                                                                        |
| `--filename`               | `-f`  | `string`                   | The output filename for the PDF. Default is the [hostname](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname) of the provided URL.                                                                                                                                                                                                                                                                                                                                   |
| `--following-html`         |       | `string`                   | Path to an HTML file which content will be inserted an the end of the PDF file. Its behavior is similar to the `--preceding-html` option.                                                                                                                                                                                                                                                                                                                                        |
| `--footer`                 |       | `string`                   | Path to an HTML file for the PDF print footer. For more details, check [PDF header and footer](#header-footer) section and [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions#headertemplate).                                                                                                                                                                                                                                                                   |
| `--format`                 |       | `string`                   | The paper format (e.g., `A4`, `Letter`) for the PDF file. Refer to [Puppeteer's paper formats](https://pptr.dev/api/puppeteer.paperformat) for more details                                                                                                                                                                                                                                                                                                                      |
| `--header`                 |       | `string`                   | Path to an HTML file that will be used as a print header for the generated PDF. For more details, check [PDF header and footer](#header-footer) section and [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions#headertemplate).                                                                                                                                                                                                                                  |
| `--help`                   | `-h`  | `boolean`                  | Displays the help message and exits.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `--last`                   | `-l`  | `string`                   | Sets the last link to parse (e.g. `--last /docs/demo`). Further parsing stops once this link is reached and parsed.                                                                                                                                                                                                                                                                                                                                                              |
| `--margins`                |       | `string`                   | Sets margins for the PDF file. Provide a string with 4 values separated by `space`, reflecting the top, right, bottom and left margins respectively. Default value is `'1cm 1cm 1cm 1.5cm'`.                                                                                                                                                                                                                                                                                     |
| `--no-contents`            |       | `boolean`                  | Disables generation of the table of contents in the PDF.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `--no-starlight-print-css` |       | `boolean`                  | Disables the default `@media print` CSS styles applied by Starlight. Enabling this flag retains the website's original colors when printing.                                                                                                                                                                                                                                                                                                                                     |
| `--paddings`               |       | `string`                   | Sets padding for the PDF content. Provide a string with 4 values separated by `space`, reflecting the top, right, bottom and left paddings respectively. Paddings are disabled by default.                                                                                                                                                                                                                                                                                       |
| `--path`                   | `-p`  | `string`                   | Sets the directory path for the output PDF. Default is the current working directory.                                                                                                                                                                                                                                                                                                                                                                                            |
| `--pdf-outline`            |       | `boolean`                  | Enables a side outline in the PDF file. It's an `outline` property in [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions).                                                                                                                                                                                                                                                                                                                                       |
| `--preceding-html`         |       | `string`                   | Path to an HTML file which content will be inserted an the beginning of the PDF file. This option may be useful for adding a cover page. See [cover.html](./readme_assets/cover.html) and the [resulting PDF](./readme_assets/spectrum-docs-with-cover.pdf) for examples.                                                                                                                                                                                                        |
| `--print-bg`               |       | `boolean`                  | Enables printing of background graphics. It's a `printBackground` property in [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions/).                                                                                                                                                                                                                                                                                                                              |
| `--styles`                 |       | `string`                   | Path to a CSS file for custom PDF styles. The styles are injected into the `<style>` tag inside the `<body>` element. Also check the list of [special CSS classes](#classes) used by the tool.                                                                                                                                                                                                                                                                                   |
| `--timeout`                |       | `string`                   | Timeout for both the page actions and `protocolTimeout` in milliseconds. You may need to increase this value for parsing large websites. The default value is `180_000` (2 minutes).                                                                                                                                                                                                                                                                                             |
| `--version`                | `-v`  | `boolean`                  | Displays the tool version and exits.                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Usage example <a id="usage"></a>

```bash
npx starlight-to-pdf spectrum.snipshot.dev -p ./output --filename spectrum-docs --contents-name "Table of contents" --margins '0 0 0 0' --paddings '2cm 1cm 2cm 1.5cm' --exclude '/demo /contacts' --header ./readme_assets/header-template.html --footer ./readme_assets/footer-template.html --print-bg --pdf-outline
```

Resulting PDF file: [spectrum-docs.pdf](./readme_assets/spectrum-docs.pdf)

### Special CSS classes <a id="classes"></a>

- `.s2pdf-container` - The wrapper around all the website parsed content
  _(excluding the table of contents)_.
- `.s2pdf-contents` - The `<ul>` element containing the generated table of
  contents.
- `.s2pdf-heading` - The element that contains `<h1>` headings of each page.
- `.s2pdf-pagebreak` - Each page text content with a defined CSS
  `break-after: page` property.

### PDF header and footer <a id="header-footer"></a>

You can provide an HTML template for the print header and footer of the
generated PDF file. Inside the templates you may also include HTML elements with
the following classes and values will be automatically injected into them:

- `.date` - formatted print date;
- `.pageNumber` - current page number;
- `.totalPages` - total number of pages in the document.

> Note that Puppeteer's template classes `.title` and `.url` are useless for the
> tool, as the PDF file is generated on one web page and these values will be
> the same on all document pages. However, you may still use them in your
> template, if necessary.

Some things to keep in mind:

- The template must be a valid HTML structure.
- You should define `font-size` property as Puppeteer's default value is `0`.
- Use inline `<style>` tag to define your styles. Website styles are **not
  available** inside the templates.
- Images should be encoded as base64 strings.
- Use `--margins` and `--paddings` options to achieve the desired layout.

Check [header-template.html](./readme_assets/header-template.html) and
[footer-template.html](./readme_assets/footer-template.html) as valid
examples.  
You may also check [the resulting PDF file](./readme_assets/spectrum-docs.pdf).

### Demo <a id="demo"></a>

![Usage demo](./readme_assets/demo.gif)

## 🤖 GitHub Actions <a id="actions"></a>

To set up GitHub Actions, create a `.github/workflows` folder in the root of
your project. Use the example
[YAML file for GitHub Actions](./readme_assets/github_actions_example.yml)
provided. This file includes all the steps required to generate a PDF file, add
it to the `dist` folder, and deploy your website to
[Netlify](https://www.netlify.com/).

Key points:

- The workflow installs Chromium and specifies its executable path using the
  `--browser-executable` flag.

- In the example, the output folder is set to `./dist/_pdf`, making the PDF
  accessible at `https://your.website/_pdf/docs.pdf`. Do not forget to change
  the `--filename` in the example YAML file.

- If your preview server uses a custom port, update the following steps in the
  YAML file accordingly:

  - `Record preview server's process ID`
  - `Create PDF`

- If your project has a custom build command, modify the YAML file to fit your
  workflow.

### Deploying with Netlify <a id="netlify"></a>

The example YAML assumes deployment to Netlify. If you use a different hosting
provider, update the deployment steps to match your setup.

For Netlify, follow these steps:

1. Obtain your Netlify Auth Token from
   [User settings](https://app.netlify.com/user/applications#personal-access-tokens).

2. Get your Site ID from
   `Site page > Site configuration > Site details > Site information`.

3. Add them as repository secrets under the names `NETLIFY_AUTH_TOKEN` and
   `NETLIFY_SITE_ID`. Check
   [GitHub's guide](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
   for details.

### Generating PDF locally <a id="generate-local"></a>

To generate a PDF file during local development, add the following command to
your `package.json`:

```json
"scripts": {
    "pdf": "npm run build && (npm run preview > /dev/null & sleep 5); lsof -ti:4321 > preview.pid; npx starlight-to-pdf http://localhost:4321 -p ./public/_pdf --filename docs --pdf-outline; kill $(cat preview.pid) && rm preview.pid && echo 'PDF script finished'"
}
```

This script will generate the PDF and save it in the `public/_pdf` folder.

Note, if your preview server uses a non-default port, or your project requires a
custom build command, update the script accordingly.

## 📨 Contacts <a id="contacts"></a>

If you want to get in touch, you may open a
[GitHub issue](https://github.com/Linkerin/starlight-to-pdf/issues) or email me
at: [gusev@snipshot.dev](mailto:gusev@snipshot.dev).

## 🪪 License <a id="license"></a>

**starlight-to-pdf** is licensed under the MIT License. See the
[LICENSE](https://github.com/Linkerin/starlight-to-pdf/blob/main/LICENSE) file
for details.

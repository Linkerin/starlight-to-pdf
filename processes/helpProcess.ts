import logger from '../services/Logger';

function helpProcess() {
  let helpMessage = `Starlight to PDF 📖

Usage: npx starlight-to-pdf [options]
    npx starlight-to-pdf [url] [options]

Example: npx starlight-to-pdf spectrum.snipshot.dev -p ./output
         --filename spectrum-docs --contents-name "Table of contents"
         --margins '0 0 0 0' --paddings '1cm 1cm 1cm 1.5cm'
         --exclude /demo  --print-bg

Options:
--url	-u	The URL of the Starlight powered documentation website to convert to PDF. The only positional argument can be used instead of this flag.
--contents-name	The name used for the generated table of contents in the PDF. By default, it's "Contents".
--exclude	-e	A string containing links separated by space that shouldn't be added to the resulting PDF file (e.g. --exclude '/docs/contacts /docs/demo'). You may also provide multiple values: -e /docs/contacts -e /docs/demo.
--filename	-f	The output filename for the generated PDF. Default is the hostname of the provided website.
--format	The paper format (e.g., A4, Letter) for the generated PDF. Check Puppeteer's paper formats for more details.
--help	-h	Displays the help message and exits.
--margins	Sets margins for the PDF file. They must be provided as a string with 4 values separates by space, reflecting the top, right, bottom and left margins respectively. Default value is '1cm 1cm 1cm 1.5cm'.
--no-contents	Disables the table of contents in the generated PDF.
--paddings	Sets padding for the PDF content. They must be provided as a string with 4 values separates by space, reflecting the top, right, bottom and left paddings respectively. Paddings are disabled by default.
--path	-p	The directory path where the PDF will be saved. Default value is the current working directory.
--print-bg	Set to print background graphics. It's a \`printBackground\` property in Puppeteer's PDFOptions.
--version	-v	Displays the version of the tool and exits.
  `;

  logger.info(helpMessage);

  process.exit(0);
}

export default helpProcess;

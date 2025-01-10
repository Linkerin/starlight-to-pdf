import { logger } from '../services/Logger';
import { cliColor, cliNeutralText, cliTextStyle } from '../utils/cliStylings';

function helpProcess() {
  let helpMessage = `Starlight to PDF 📖

Usage: ${cliColor('npx', 'blue')} starlight-to-pdf ${cliNeutralText(
    '[options]'
  )}
       ${cliColor('npx', 'blue')} starlight-to-pdf ${cliNeutralText(
    '[url] [options]'
  )}

Example: ${cliColor(
    'npx',
    'blue'
  )} starlight-to-pdf spectrum.snipshot.dev ${cliNeutralText('-p')} ./output
         ${cliNeutralText('--filename')} spectrum-docs ${cliNeutralText(
    '--contents-name'
  )} "Table of contents"
         ${cliNeutralText('--margins')} '0 0 0 0' ${cliNeutralText(
    '--paddings'
  )} '1cm 1cm 1cm 1.5cm'
         ${cliNeutralText('--exclude')} /demo ${cliNeutralText('--print-bg')}

Options:
--url	-u	${cliNeutralText(
    'The URL of the Starlight powered documentation website to convert to PDF. The only positional argument can be used instead of this flag.'
  )}
--browser-executable	${cliNeutralText(
    'Specifies a path to a browser executable to use instead of the default one (e.g. --browser-executable /usr/bin/chromium-browser).'
  )}
--contents-name	${cliNeutralText(
    `Customizes the generated table of contents name in the PDF. Default: ${cliTextStyle(
      '`Contents`',
      'bold'
    )}.`
  )}
--css-page-size	${cliNeutralText(
    "Allows setting the PDF page size using CSS `@page`. If the predefined sizes in the '--format' option don't meet your needs, enable this option and specify the desired page size in custom CSS provided via the '--styles' flag (e.g., `@page { size: 8.5in 14in; }`). Note: if you define a page size in CSS without enabling this option, the size from the '--format' option will be used instead, and the content will be scaled to fit the dimensions specified in `@page`."
  )}
--exclude	-e	${cliNeutralText(
    `A string containing links separated by space that shouldn't be added to the resulting PDF file (e.g. --exclude '/docs/contacts /docs/demo'). You may also provide multiple values: -e /docs/contacts -e /docs/demo.`
  )}
--filename	-f	${cliNeutralText(
    'The output filename for the PDF. Default is the hostname of the provided URL.'
  )}
--following-html	${cliNeutralText(
    "Path to an HTML file which content will be inserted an the end of the PDF file. Its behavior is similar to the '--preceding-html' option."
  )}
--footer	${cliNeutralText(
    "Path to the HTML file for the PDF print footer. For more details, check PDF header and footer section in the README and Puppeteer's PDFOptions."
  )}
--format	${cliNeutralText(
    "The paper format (e.g., A4, Letter) for the PDF file. Refer to Puppeteer's paper formats for more details."
  )}
--header	${cliNeutralText(
    "Path to the HTML file for the PDF print header. For more details, check PDF header and footer section in the README and Puppeteer's PDFOptions."
  )}
--help	-h	${cliNeutralText('Displays the help message and exits.')}
--last	-l	${cliNeutralText(
    'Sets the last link to parse (e.g. --last /docs/demo). Further parsing stops once this link is reached and parsed.'
  )}
--margins	${cliNeutralText(
    `Sets margins for the PDF file. Provide a string with 4 values separated by space, reflecting the top, right, bottom and left margins respectively. Default value is ${cliTextStyle(
      "'1cm 1cm 1cm 1.5cm'",
      'bold'
    )}.`
  )}
--no-contents	${cliNeutralText(
    'Disables generation of the table of contents in the PDF.'
  )}
--paddings	${cliNeutralText(
    'Sets padding for the PDF content. Provide as a string with 4 values separated by space, reflecting the top, right, bottom and left paddings respectively. Paddings are disabled by default.'
  )}
--path	-p	${cliNeutralText(
    'Sets the directory path for the output PDF. Default is the current working directory.'
  )}
--pdf-outline	${cliNeutralText(
    "Enables a side outline in the PDF file. It's an `outline` property in Puppeteer's PDFOptions."
  )}
--preceding-html	${cliNeutralText(
    'Path to an HTML file which content will be inserted an the beginning of the PDF file. This option may be useful for adding a cover page.'
  )}
--print-bg	${cliNeutralText(
    "Enables printing of background graphics. It's a `printBackground` property in Puppeteer's PDFOptions."
  )}
--styles	${cliNeutralText(
    'Path to a CSS file for custom PDF styles. The styles are injected into the `<style>` tag inside the `<body>` element. Also check the README for a list of special CSS classes used by the tool.'
  )}
--timeout	${cliNeutralText(
    'Timeout for both the page actions and `protocolTimeout` in milliseconds. You may need to increase this value for parsing large websites. The default value is `120000` (2 minutes).'
  )}
--version	-v	${cliNeutralText('Displays the tool version and exits.')}
  `;

  logger.info(helpMessage);
  logger.stop();

  process.exit(0);
}

export default helpProcess;

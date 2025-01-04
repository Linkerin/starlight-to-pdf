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
--contents-name	${cliNeutralText(
    `The name used for the generated table of contents in the PDF. By default, it's ${cliTextStyle(
      '`Contents`',
      'bold'
    )}.`
  )}
--exclude	-e	${cliNeutralText(
    `A string containing links separated by space that shouldn't be added to the resulting PDF file (e.g. --exclude '/docs/contacts /docs/demo'). You may also provide multiple values: -e /docs/contacts -e /docs/demo.`
  )}
--filename	-f	${cliNeutralText(
    'The output filename for the generated PDF. Default is the hostname of the provided website.'
  )}
--format	${cliNeutralText(
    "The paper format (e.g., A4, Letter) for the generated PDF. Check Puppeteer's paper formats for more details."
  )}
--help	-h	${cliNeutralText('Displays the help message and exits.')}
--margins	${cliNeutralText(
    `Sets margins for the PDF file. They must be provided as a string with 4 values separates by space, reflecting the top, right, bottom and left margins respectively. Default value is ${cliTextStyle(
      "'1cm 1cm 1cm 1.5cm'",
      'bold'
    )}.`
  )}
--no-contents	${cliNeutralText(
    'Disables the table of contents in the generated PDF.'
  )}
--paddings	${cliNeutralText(
    'Sets padding for the PDF content. They must be provided as a string with 4 values separates by space, reflecting the top, right, bottom and left paddings respectively. Paddings are disabled by default.'
  )}
--path	-p	${cliNeutralText(
    'The directory path where the PDF will be saved. Default value is the current working directory.'
  )}
--pdf-outline	${cliNeutralText(
    "Generates an outline for the PDF file on the side. It's an `outline` property in Puppeteer's PDFOptions."
  )}
--print-bg	${cliNeutralText(
    "Set to print background graphics. It's a `printBackground` property in Puppeteer's PDFOptions."
  )}
--timeout	${cliNeutralText(
    'Timeout for both the page actions and `protocolTimeout` in milliseconds. You may need to increase this value for parsing large websites. The default value is `120000` (2 minutes).'
  )}
--version	-v	${cliNeutralText('Displays the version of the tool and exits.')}
  `;

  logger.info(helpMessage);
  logger.stop();

  process.exit(0);
}

export default helpProcess;

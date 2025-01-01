import getVersion from '../utils/getVersion';
import { logger } from '../services/Logger';

async function versionProcess() {
  const version = await getVersion();

  if (!version) {
    logger.error('Could not find version info');
    return;
  }

  logger.info(`v${version}`);
  logger.stop();

  process.exit(0);
}

export default versionProcess;

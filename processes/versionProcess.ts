import { showVersion } from "../utils/version";

async function versionProcess() {
  await showVersion();
  process.exit(0);
}

export default versionProcess;

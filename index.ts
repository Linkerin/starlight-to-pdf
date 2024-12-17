#!/usr/bin/env node

import CliArgs from "./utils/CliArgs";
import mainProcess from "./processes/mainProcess";
import versionProcess from "./processes/versionProcess";

const cliArgs = new CliArgs();

if (cliArgs.values.version) {
  await versionProcess();
}

await mainProcess(cliArgs);

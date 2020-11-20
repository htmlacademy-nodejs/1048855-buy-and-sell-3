"use strict";
const chulk = require("chalk");
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.info(chulk.blue(version));
  },
};

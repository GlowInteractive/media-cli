const files = require("../helpers/files");
const webpackServer = require("./webpack-setup");
const inquirer = require("inquirer");
const logger = require("../helpers/logger");
const changeCase = require("change-case");

const {
  onBuildUnit,
  onUnitBuilt,
  onBuildAllUnits,
  onAllUnitsBuilt
} = require("../helpers/messages");

// Only ask user to choose directory if multiple units exist.
// Otherwise display a list of directory choices to serve.
async function askForUnitDirname(
  message = "What unit would you like to serve?"
) {
  const choices = await files.mediaUnitDirnames;

  if (choices.length === 1) {
    return { dir: choices[0] };
  } else {
    let unitToServe = await inquirer.prompt([
      {
        type: "list",
        choices,
        name: "dir",
        message: logger.colorizeText(message)
      }
    ]);
    return unitToServe;
  }
}

module.exports = {
  async serve() {
    const { dir } = await askForUnitDirname();
    webpackServer.serve(dir);
  },
  async build() {
    const { dir } = await askForUnitDirname(
      "What unit would you like to build?"
    );
    logger.log(onBuildUnit(dir));
    await webpackServer.build(dir);
    logger.logWithBg(onUnitBuilt(dir));
  },
  async buildAll() {
    logger.log(onBuildAllUnits);
    await webpackServer.buildAll();
    logger.logWithBg(onAllUnitsBuilt);
  }
};

const files = require("../helpers/files");
const webpackServer = require("./webpack-setup");
const inquirer = require("inquirer");
const logger = require("../helpers/logger");
const {
  onBuildUnit,
  onUnitBuilt,
  onBuildAllUnits,
  onAllUnitsBuilt
} = require("../helpers/messages");

async function askForUnitDirname(
  message = "What unit would you like to serve?"
) {
  const choices = await files.mediaUnitDirnames;

  return await inquirer.prompt([
    {
      type: "list",
      choices,
      name: "dirToServe",
      message: logger.colorizeText(message)
    }
  ]);
}

module.exports = {
  async serve() {
    const response = await askForUnitDirname();
    webpackServer.serve(response.dirToServe);
  },
  async build() {
    const { dirToServe } = await askForUnitDirname(
      "What unit would you like to build?"
    );
    logger.log(onBuildUnit(dirToServe));
    await webpackServer.build(dirToServe);
    logger.logWithBg(onUnitBuilt(dirToServe));
  },
  async buildAll() {
    logger.log(onBuildAllUnits);
    await webpackServer.buildAll();
    logger.logWithBg(onAllUnitsBuilt);
  }
};

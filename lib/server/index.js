const files = require("../helpers/files");
const webpackServer = require("./webpack-setup");
const inquirer = require("inquirer");
const logger = require("../helpers/logger");
const argv = require("minimist")(process.argv.slice(2));
const isTemplate = argv.t || argv.template;

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
  let unitToServe;
  const choices = isTemplate
    ? await files.getUserTemplateDirnames()
    : await files.mediaUnitDirnames;

  if (choices.length === 1) {
    unitToServe = choices[0];
    return;
  } else {
    const { dir } = await inquirer.prompt([
      {
        type: "list",
        choices,
        name: "dir",
        message: logger.colorizeText(message)
      }
    ]);
    unitToServe = dir;
  }

  return isTemplate
    ? files.getUserTemplatePath(unitToServe)
    : files.getMediaUnitPath(unitToServe);
}

module.exports = {
  async serve() {
    const dir = await askForUnitDirname();
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

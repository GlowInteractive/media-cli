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
    console.log(unitToServe);
  }

  if (isTemplate) {
    return {
      dir: files.getUserTemplatePath(unitToServe),
      dirName: unitToServe
    };
  } else {
    return { dir: files.getMediaUnitPath(unitToServe), dirName: unitToServe };
  }
}

module.exports = {
  async serve() {
    const { dir } = await askForUnitDirname();
    webpackServer.serve(dir);
  },
  async build() {
    const { dir, dirName } = await askForUnitDirname(
      "What unit would you like to build?"
    );

    logger.log(onBuildUnit(dir));
    await webpackServer.build(dirName);
    logger.logWithBg(onUnitBuilt(dir));
  },
  async buildAll() {
    logger.log(onBuildAllUnits);
    await webpackServer.buildAll();
    logger.logWithBg(onAllUnitsBuilt);
  }
};

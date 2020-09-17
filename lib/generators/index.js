const inquirer = require("inquirer");
const files = require("../helpers/files");
const unit = require("../unit");
const logger = require("../helpers/logger");

const createUnitName = (pre, size, lmr) => {
  return `${pre}-${size}-${lmr.split(" ")[0]}`;
};

async function generateCampaign(unitToGenerate) {
  const templateAbsPath =
    files.userTemplatesDir + "/" + unitToGenerate.templateName;

  //should try to remove refs to LMR - make as abstract as possible for reuse.
  const unitName = createUnitName(
    unitToGenerate.namePrefix,
    unitToGenerate.size,
    unitToGenerate.lmr
  );

  // maybe we can send in a data struct of filenames we're hydrating, so we can then remove them after

  return new Promise(async (res, rej) => {
    try {
      const h = await unit.renderHTML({
        templateData: { ...unitToGenerate },
        templateFilePath: templateAbsPath + "/index.ejs"
      });

      //todo turn this into a hook we can tap into?
      if (unitToGenerate.references && unitToGenerate.lmr) {
        const isi = await unit.renderHTML({
          templateData: { ...unitToGenerate },
          templateFilePath: templateAbsPath + "/assets/isi.ejs"
        });

        //todo add a prefix to unit name
        await unit.writeTemplateToDisk(templateAbsPath, unitName, h);
        await files.write(
          files.getMediaUnitPath(unitName) + "/assets/isi.html",
          isi
        );
        await files.remove(
          files.getMediaUnitPath(unitName) + "/assets/isi.ejs"
        );
      }

      res();
    } catch (err) {
      logger.error(`\n\n${err.msg || err}\n\n`);
      rej(err);
    }
  });
}

module.exports = {
  async start() {
    const generatorFiles = await inquirer.prompt({
      name: "file",
      type: "list",
      choices: files.getGenerators(),
      validate: function (input) {
        return !!input ? true : "You must choose a generator.";
      }
    });

    const campaignsToGenerate = require(files.generatorDirname +
      "/" +
      generatorFiles.file);

    await Promise.all(campaignsToGenerate.map(generateCampaign)).then(() => {
      logger.logWithBg(
        `Success. You just generated ${campaignsToGenerate.length} units. Daaaaaamn. POP POP!`
      );
    });
  }
};

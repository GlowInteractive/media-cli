const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const logger = require("../helpers/logger");
const createQuestions = require("./questions");
const config = require("../helpers/config");
const { unitCreated } = require("../helpers/messages");

async function copyAndWriteUnit(mediaUnitDir, html) {
  await files.copy(files.baseTemplateDir, mediaUnitDir);
  await files.write(`${mediaUnitDir}/index.html`, html);
  await files.remove(`${mediaUnitDir}/index.ejs`);
}

async function buildTemplateData(responses) {
  const campaignConfig = await config.get();
  const sizeSplit = responses.size.split("x");

  return {
    ...responses,
    ...campaignConfig,
    sizeMeta: `width=${sizeSplit[0]},height=${sizeSplit[1]}`
  };
}

async function renderHTML(responses) {
  const templateFilePath = files.baseTemplateDir + "/index.ejs";
  const templateData = await buildTemplateData(responses);

  return new Promise((res, rej) => {
    ejs.renderFile(templateFilePath, templateData, {}, (err, html) => {
      if (err) {
        rej(err);
      } else {
        res(html);
      }
    });
  });
}

async function writeTemplateToDisk(unitName, html) {
  const dirToCreate = files.getMediaUnitPath(unitName);
  const unitExists = files.directoryExists(dirToCreate);

  if (unitExists) {
    throw {
      msg: "That unit already exists. Try again with another unit name.",
      type: "unit",
      err: "Unit Exists"
    };
  } else {
    await copyAndWriteUnit(dirToCreate, html);
  }
}

module.exports = {
  async create() {
    const questions = createQuestions();
    const responses = await inquirer.prompt(questions);
    const html = await renderHTML(responses);
    await writeTemplateToDisk(responses.name, html);

    logger.log(unitCreated(responses.name));
  }
};

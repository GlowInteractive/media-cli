const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const msg = require("../helpers/messages");
const createQuestions = require("./questions");
const config = require("../helpers/config");

async function copyAndWriteUnit(mediaUnitDir, html) {
  await files.copy(files.baseTemplateDir, mediaUnitDir);
  await files.write(`${mediaUnitDir}/index.html`, html);
  await files.remove(`${mediaUnitDir}/index.ejs`);
}

async function buildTemplateData(answers) {
  const campaignConfig = await config.get();
  const sizeSplit = answers.size.split("x");

  return {
    ...answers,
    ...campaignConfig,
    sizeMeta: `width=${sizeSplit[0]},height=${sizeSplit[1]}`
  };
}

async function renderHTML(answers) {
  const templateFilePath = files.baseTemplateDir + "/index.ejs";
  const templateData = await buildTemplateData(answers);

  ejs.renderFile(templateFilePath, templateData, {}, (err, html) => {
    if (err) {
      throw err;
    } else {
      return html;
    }
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
  async create(name) {
    const questions = createQuestions(name);
    const responses = await inquirer.prompt(questions);
    const answers = { name, ...responses };
    const html = await renderHTML(answers);

    await writeTemplateToDisk(answers.name, html);

    msg.logWithBg(
      `\n\nSuccess! Created unit ${answers.name}.\n\nServe it with yarn start -u ${answers.name}\n\n`
    );
  }
};

const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const logger = require("../helpers/logger");
const createQuestions = require("./questions");
const config = require("../helpers/config");
const { snakeCase } = require("snake-case");
const { unitCreated } = require("../helpers/messages");

async function copyAndWriteUnit(templateDir, mediaUnitDir, html) {
  await files.copy(templateDir, mediaUnitDir);
  await files.write(`${mediaUnitDir}/index.html`, html);
  await files.remove(`${mediaUnitDir}/index.ejs`);
}

async function buildTemplateData(responses) {
  const campaignConfig = await config.get();
  const [width, height] = responses.size.split("x");

  return {
    ...responses,
    ...campaignConfig,
    sizeMeta: `width=${width},height=${height}`,
    width: width + "px",
    height: height + "px"
  };
}

async function renderHTML({ responses, templateFilePath }) {
  var templateVars = {};

  if (responses) {
    templateVars = await buildTemplateData(responses);
  }

  return new Promise((res, rej) => {
    ejs.renderFile(templateFilePath, templateVars, {}, (err, html) => {
      if (err) {
        rej(err);
      } else {
        res(html);
      }
    });
  });
}

async function writeTemplateToDisk(template, unitName, html) {
  const dirToCreate = files.getMediaUnitPath(unitName);
  const unitExists = files.directoryExists(dirToCreate);

  if (unitExists) {
    throw {
      msg: "That unit already exists. Try again with another unit name.",
      type: "unit",
      err: "Unit Exists"
    };
  } else {
    await copyAndWriteUnit(template, dirToCreate, html);
  }
}

module.exports = {
  async create() {
    var unitName;
    var templateVars;
    var templatePath;

    const baseTemplates = await files.getTemplateDirnames();
    const userTemplates = await files.getUserTemplateDirnames();

    const chooseTemplate = await inquirer.prompt({
      name: "template",
      type: "list",
      choices: [...baseTemplates, ...userTemplates],
      message: logger.colorizeText(
        "What template would you like to start with?"
      ),
      validate: function (input) {
        return !!input ? true : "A Template is required.";
      }
    });

    if (userTemplates.includes(chooseTemplate.template)) {
      const unit = await inquirer.prompt({
        type: "input",
        name: "name",
        message: logger.colorizeText("Enter Media Unit Name."),
        validate: function (input) {
          return !!input ? true : "Media Unit Name is required.";
        },
        filter: function (input) {
          return snakeCase(input);
        }
      });

      unitName = unit.name;

      const dirFrom = files.userTemplatesDir + "/" + chooseTemplate.template;
      templatePath = dirFrom;
      const hasQuestions = files.directoryExists(dirFrom + "/questions.js");

      if (hasQuestions) {
        const userQuestions = require(dirFrom + "/questions.js");
        responses = await inquirer.prompt(userQuestions);
        templateVars = { ...responses };
      }
    } else {
      const questions = createQuestions();
      templateVars = await inquirer.prompt(questions);
      unitName = templateVars.name;
      templatePath = files.templatesDir + "/" + chooseTemplate.template;
    }

    const html = await renderHTML({
      responses: {
        ...templateVars
      },
      templateFilePath: templatePath + "/index.ejs"
    });

    writeTemplateToDisk(templatePath, unitName, html);
    logger.log(unitCreated(unitName));
  }
};

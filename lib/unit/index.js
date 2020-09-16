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
  await files.remove(`${mediaUnitDir}/questions.js`);
}

async function buildTemplateData(templateData) {
  const campaignConfig = await config.get();
  const [width, height] = templateData.size
    ? templateData.size.split("x")
    : ["", ""];

  return {
    ...templateData,
    ...campaignConfig,
    sizeMeta: `width=${width},height=${height}`,
    width: width + "px",
    height: height + "px"
  };
}

async function renderHTML({ templateData, templateFilePath }) {
  var templateVars = {};

  if (templateData) {
    templateVars = await buildTemplateData(templateData);
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

  //todo allow replacing existing units
  // maybe set a global flag for this

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

async function chooseTemplate(choices) {
  const template = await inquirer.prompt({
    name: "path",
    type: "list",
    choices,
    message: logger.colorizeText("Choose Your Template"),
    validate: function (input) {
      return !!input ? true : "A Template is required.";
    }
  });

  return template;
}

module.exports = {
  async create() {
    var unitName;
    var templateVars;
    var templatePath;

    const baseTemplates = await files.getTemplateDirnames();
    const userTemplates = await files.getUserTemplateDirnames();

    const template = await chooseTemplate([...baseTemplates, ...userTemplates]);

    const questions = createQuestions();

    if (userTemplates.includes(template.path)) {
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
      templatePath = files.userTemplatesDir + "/" + template.path;

      const hasQuestions = files.directoryExists(
        templatePath + "/questions.js"
      );

      if (hasQuestions) {
        const userQuestions = require(templatePath + "/questions.js");
        responses = await inquirer.prompt([...questions, ...userQuestions]);
        templateVars = { ...responses };
      } else {
        throw {
          msg:
            "You need a questions.js file to populate the data in this unit. Did you forget to create it?",
          type: "unit",
          err: "Missing File"
        };
      }
    } else {
      templateVars = await inquirer.prompt(questions);
      unitName = templateVars.name;
      templatePath = files.templatesDir + "/" + template.path;
    }

    const html = await renderHTML({
      templateData: {
        ...templateVars
      },
      templateFilePath: templatePath + "/index.ejs"
    });

    writeTemplateToDisk(templatePath, unitName, html);
    logger.log(unitCreated(unitName));
  },
  chooseTemplate,
  renderHTML,
  buildTemplateData,
  copyAndWriteUnit,
  writeTemplateToDisk
};

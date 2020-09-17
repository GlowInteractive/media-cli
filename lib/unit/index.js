const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const logger = require("../helpers/logger");
const createQuestions = require("./questions");
const config = require("../helpers/config");
const { snakeCase } = require("snake-case");
const { unitCreated } = require("../helpers/messages");
const argv = require("minimist")(process.argv.slice(2));
const isTemplate = argv.t || argv.template;
const overwrite = argv.r || argv.replace;

async function copyAndWriteUnit(templateDir, mediaUnitDir, html) {
  await files.copy(templateDir, mediaUnitDir, {
    overwrite,
    errorOnExist: true
  });

  const fileType = isTemplate ? "ejs" : "html";
  await files.write(`${mediaUnitDir}/index.${fileType}`, html);
  await files.remove(`${mediaUnitDir}/questions.js`);

  if (!isTemplate) {
    await files.remove(`${mediaUnitDir}/index.ejs`);
  }
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
    bodyClass: `${width}x${height}`,
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
  chooseTemplate,
  renderHTML,
  buildTemplateData,
  copyAndWriteUnit,
  async create() {
    const baseTemplates = await files.getTemplateDirnames();
    const userTemplates = await files.getUserTemplateDirnames();

    // if we're creating a template, don't include user templates as opts.
    const templates = isTemplate
      ? baseTemplates
      : [...baseTemplates, ...userTemplates];

    const template = await chooseTemplate(templates);
    const templatePath = userTemplates.includes(template.path)
      ? files.userTemplatesDir + "/" + template.path
      : files.templatesDir + "/" + template.path;

    const hasQuestions = files.directoryExists(templatePath + "/questions.js");

    const userQuestions = hasQuestions
      ? require(templatePath + "/questions.js")
      : [];

    const questions = createQuestions(userQuestions);
    const templateVars = await inquirer.prompt(questions);

    const unitName = `${templateVars.name}-${templateVars.size}`;

    const dirToCreate = isTemplate
      ? files.getUserTemplatePath(unitName)
      : files.getMediaUnitPath(unitName);

    const html = await renderHTML({
      templateData: {
        ...templateVars
      },
      templateFilePath: templatePath + "/index.ejs"
    });

    copyAndWriteUnit(templatePath, dirToCreate, html);
    logger.log(unitCreated(unitName));
  }
};

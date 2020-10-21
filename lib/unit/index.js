const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const logger = require("../helpers/logger");
const createQuestions = require("./questions");
const config = require("../helpers/config");
const { unitCreated } = require("../helpers/messages");
const argv = require("minimist")(process.argv.slice(2));
const isTemplate = argv.t || argv.template;
const overwrite = argv.r || argv.replace;

async function copyAndWriteUnit(templateDir, mediaUnitDir, html) {
  await files.copy(templateDir, mediaUnitDir, {
    overwrite,
    errorOnExist: true
  });

  await files.write(
    `${mediaUnitDir}/index.${isTemplate ? "ejs" : "html"}`,
    html
  );

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
    bodyClass: `size-${width}x${height}`,
    width: width + "px",
    height: height + "px"
  };
}

async function renderHTML({ templateData, templateFilePath }) {
  const templateVars = templateData
    ? await buildTemplateData(templateData)
    : {};

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

async function chooseTemplate(baseTemplates, userTemplates) {
  const choices = isTemplate
    ? baseTemplates
    : [...baseTemplates, ...userTemplates];

  const template = await inquirer.prompt({
    name: "name",
    type: "list",
    choices,
    message: logger.colorizeText("Choose Your Template"),
    validate: function (input) {
      return !!input ? true : "A Template is required.";
    }
  });

  return template;
}

const TemplateBuilder = {
  get path() {
    return `${this.dir}/${this.templateName}`;
  },
  get hasQuestions() {
    return files.directoryExists(this.path + "/questions.js");
  },
  get templateFilePath() {
    return `${this.path}/index.ejs`;
  },
  set type(type) {
    this.dir = type === "user" ? files.userTemplatesDir : files.templatesDir;
  },
  get prompts() {
    return this.hasQuestions
      ? createQuestions(require(`${this.path}/questions.js`))
      : createQuestions();
  },
  getTemplateName: ({ name, size }) => `${name}-${size}`,
  getDirToCreate: unitName =>
    isTemplate
      ? files.getUserTemplatePath(unitName)
      : files.getMediaUnitPath(unitName),
  init({ userTemplates, chosenTemplateName }) {
    this.templateName = chosenTemplateName;

    this.type = userTemplates.includes(chosenTemplateName)
      ? "user"
      : "existing";
    return this;
  }
};

async function create() {
  const baseTemplates = await files.getTemplateDirnames();
  const userTemplates = await files.getUserTemplateDirnames();

  const { name } = await chooseTemplate(baseTemplates, userTemplates);

  const {
    prompts,
    path,
    templateFilePath,
    getDirToCreate,
    getTemplateName
  } = TemplateBuilder.init({
    userTemplates,
    chosenTemplateName: name
  });

  const templateData = await inquirer.prompt(prompts);

  const html = await renderHTML({
    templateData,
    templateFilePath
  });

  const templateToCreateName = getTemplateName(templateData);

  copyAndWriteUnit(path, getDirToCreate(templateToCreateName), html);

  logger.log(unitCreated(templateToCreateName));
}

module.exports = {
  chooseTemplate,
  renderHTML,
  buildTemplateData,
  copyAndWriteUnit,
  create
};

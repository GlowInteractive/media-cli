const inquirer = require("inquirer");
const ejs = require("ejs");
const path = require("path");
const chalk = require("chalk");
const colorize = str => chalk.bgYellow.black(str);
const fs = require("fs-extra");
const q = [
  {
    type: "input",
    name: "size",
    message: colorize("Enter Media Unit Size."),
    suffix: " 300x250, 970x250, etc...",
    default: "300x250"
  },
  {
    type: "input",
    name: "exitLink",
    message: colorize("Enter Default Exit Link"),
    default: "Visit Site"
  }
];

function askCampaignQuestions() {
  return inquirer.prompt(q);
}

module.exports = {
  async create() {
    const templateDir = path.resolve(__dirname, "../", "templates/base");
    const mediaUnitsDir = process.cwd() + "/media-units";
    const answers = await askCampaignQuestions();

    ejs.renderFile(
      templateDir + "/index.ejs",
      {
        title: "hi there",
        exitLink: answers.exitLink,
        size: answers.size
      },
      {},
      function(err, str) {
        const mediaUnitDir = `${mediaUnitsDir}/${answers.size}`;
        fs.copySync(templateDir, mediaUnitDir);
        fs.writeFileSync(`${mediaUnitDir}/index.html`, str);
      }
    );
  }
};

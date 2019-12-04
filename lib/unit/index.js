const inquirer = require("inquirer");
const ejs = require("ejs");
const files = require("../helpers/files");
const msg = require("../helpers/messages");
const createQuestions = require("./questions");
const config = require("../helpers/config");

function getMediaUnitsDir(campaignDir) {
  return campaignDir
    ? campaignDir + "/media-units"
    : files.cwd() + "/media-units";
}

module.exports = {
  async create(unitName, campaignDir = false) {
    if (campaignDir) {
      config.setPath(campaignDir + "/config");
    }

    const templateDir = files.resolve(
      __dirname,
      "../",
      "../",
      "templates/base"
    );

    const mediaUnitsDir = getMediaUnitsDir(campaignDir);
    const answers = await inquirer.prompt(createQuestions(unitName));
    const campaignConfig = config.get();
    const sizeSplit = answers.size.split("x");

    ejs.renderFile(
      templateDir + "/index.ejs",
      {
        title: "",
        exitLink: answers.exitLink,
        size: answers.size,
        ...campaignConfig,
        sizeMeta: `width=${sizeSplit[0]},height=${sizeSplit[1]}`
      },
      {},
      function(err, str) {
        const mediaUnitDir = `${mediaUnitsDir}/${unitName || answers.name}`;

        // could handle this existence check in files.js
        if (files.directoryExists(mediaUnitDir)) {
          msg.error("Come on!. That unit already exists.");
          this.create();
        } else {
          files.copy(templateDir, mediaUnitDir);
          files.write(`${mediaUnitDir}/index.html`, str);
          files.remove(`${mediaUnitDir}/index.ejs`);
        }
      }
    );
  }
};

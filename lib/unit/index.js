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

module.exports = {
  async create(unitName) {
    const questions = createQuestions(unitName);
    const answers = await inquirer.prompt(questions);
    const campaignConfig = await config.get();
    const sizeSplit = answers.size.split("x");

    ejs.renderFile(
      files.baseTemplateDir + "/index.ejs",
      {
        ...answers,
        ...campaignConfig,
        sizeMeta: `width=${sizeSplit[0]},height=${sizeSplit[1]}`
      },
      {},
      async (err, str) => {
        const mediaUnitDir = `${files.mediaUnitsDir}/${unitName ||
          answers.name}`;
        if (err) console.log(err);

        // could handle this existence check in files.js
        if (files.directoryExists(mediaUnitDir)) {
          msg.error("\nCome on!. That unit already exists.\nTry again bud.\n");
          this.create();
        } else {
          await copyAndWriteUnit(mediaUnitDir, str);
          msg.log(`\n\nSuccess! Created unit ${unitName || answers.name}.\n\n`);
          msg.log(
            `Serve it with yarn start -u ${unitName || answers.name}\n\n`
          );
        }
      }
    );
  }
};

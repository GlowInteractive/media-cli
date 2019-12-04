const simpleGit = require("simple-git")();
const { exec } = require("child_process");
const msg = require("../helpers/messages");
const files = require("../helpers/files");
const questions = require("./questions");
const inquirer = require("inquirer");
const unit = require("../unit");

function askCampaignQuestions() {
  return inquirer.prompt(questions);
}

module.exports = {
  repoPath: "git@github.com:GlowInteractive/media-campaign-scaffold.git",
  countdown: msg.countdown(
    "Scaffolding Your Media Campaign. This might take a minute."
  ),
  cloneRepo() {
    return new Promise((res, rej) => {
      simpleGit.clone(this.repoPath, this.config.campaignName).exec(res);
    });
  },
  npmInstall() {
    return new Promise((res, rej) => {
      exec(`cd ${this.config.campaignName} && yarn`, (err, stdout, stderr) => {
        if (err) {
          msg.error(err);
        } else {
          res();
        }
      });
    });
  },
  successMsg() {
    msg.log(
      `\nSuccess! \nRun cd ${this.config.campaignName}\nand create some media units.\n\n`
    );
  },
  async continueOrEnd() {
    const answers = await inquirer.prompt({
      type: "confirm",
      name: "createUnit",
      message: "Would you like to create a media unit now?"
    });

    if (answers.createUnit) {
      unit.create(false, files.resolve(files.cwd(), this.config.campaignName));
    } else {
      this.successMsg();
      process.exit(0);
    }
  },
  async create(campaignName) {
    if (files.directoryExists(campaignName)) {
      msg.error(`Come on! The '${campaignName}' directory already exists.`);
      msg.error("Try again with another name.\n\n");
      process.exit(0);
    }

    const answers = await askCampaignQuestions();

    this.config = {
      campaignName,
      ...answers
    };

    this.countdown.start();
    await this.cloneRepo();
    await this.npmInstall();
    this.countdown.stop();

    files.writeJson(`${campaignName}/config`, this.config);

    this.continueOrEnd();
  }
};

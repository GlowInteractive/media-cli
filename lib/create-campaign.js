const simpleGit = require("simple-git")();
const fs = require("fs-extra");
const { exec } = require("child_process");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const chalk = require("chalk");
const log = console.log;

module.exports = {
  countdown: new Spinner(
    chalk.bgYellow.black(
      "Scaffolding Your Media Campaign. This might take a minute."
    ),
    ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
  ),
  repoPath: "git@github.com:GlowInteractive/media-campaign-scaffold.git",
  cloneRepo(name) {
    simpleGit.clone(this.repoPath, name).exec(() => {
      exec(`cd ${name} && npm install`, (err, stdout, stderr) => {
        this.countdown.stop();
        this.successMsg();
      });
    });
  },
  successMsg() {
    log(
      chalk.bgYellow.black(
        `\n\n\n              Success!              
          Run cd ${this.campaignName}            \n     and create some media units.   \n\n`
      )
    );
  },
  errorMsg() {
    log(chalk.bgYellow.black("\n\n  Woops. That directory already exists."));
    log(chalk.bgYellow.black("      Try again with another name.     \n\n"));
  },
  create(campaignName) {
    this.campaignName = campaignName;

    if (fs.existsSync(campaignName)) {
      this.errorMsg();
    } else {
      this.countdown.start();
      this.cloneRepo(campaignName);
    }
  }
};

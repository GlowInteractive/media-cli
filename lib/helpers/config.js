const files = require("./files");
const buildQuestions = require("./questions");
const inquirer = require("inquirer");
const msg = require("./messages");

module.exports = {
  path: files.cwd() + "/config",
  setPath(path) {
    this.path = path;
  },
  get(path = false) {
    const configPath = path || this.path;
    return files.readJson(configPath);
  },
  update(config) {
    return files.writeJson(this.path, config);
  },
  exists() {
    return files.pathExists(this.path);
  },
  async setup(campaignName) {
    msg.log(
      `\nLooks like this is your first time running this command.\nLet's get setup.\n\n`
    );
    const questions = buildQuestions(campaignName);
    const responses = await inquirer.prompt(questions);
    await this.update(responses);
    msg.log(`\n Okay Thanks. You're all setup.\n`);
    return this.get(this.path);
  }
};

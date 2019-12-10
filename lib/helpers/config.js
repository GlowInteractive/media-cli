const files = require("./files");
const buildQuestions = require("./questions");
const inquirer = require("inquirer");
const msg = require("./messages");

module.exports = {
  path: files.cwd() + "/config",
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
    msg.logWithBg(
      `Looks like this is your first time running this command.\n\nLet's get setup.\n\n`
    );
    const questions = buildQuestions(campaignName);
    const responses = await inquirer.prompt(questions);
    await this.update(responses);
    msg.logWithBg(
      `\nOkay Thanks. You're all setup.\nLet's create your first unit.\n`
    );
    return this.get(this.path);
  }
};

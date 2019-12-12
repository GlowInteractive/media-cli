const files = require("./files");
const buildQuestions = require("./questions");
const inquirer = require("inquirer");
const logger = require("./logger");
const { firstTime, setupDone } = require("./messages");

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
    if (this.exists()) {
      return this.get(this.path);
    }

    logger.logWithBg(firstTime);
    const questions = buildQuestions(campaignName);
    const responses = await inquirer.prompt(questions);
    await this.update(responses);
    logger.logWithBg(setupDone);
    return this.get(this.path);
  }
};

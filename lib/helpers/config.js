const files = require("./files");
const buildQuestions = require("./questions");
const inquirer = require("inquirer");

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
    const questions = buildQuestions(campaignName);
    const responses = await inquirer.prompt(questions);
    await this.update(responses);
    return files.readJson(this.path);
  }
};

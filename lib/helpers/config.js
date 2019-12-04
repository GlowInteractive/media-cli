const files = require("./files");

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
    files.writeJson(this.path, config);
  }
};

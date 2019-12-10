const fs = require("fs-extra");
const path = require("path");

module.exports = {
  directoryExists(path) {
    return fs.existsSync(path);
  },
  cwd() {
    return process.cwd();
  },
  write(path, data) {
    return fs.outputFile(path, data);
  },
  copy(from, to) {
    return fs.copy(from, to);
  },
  writeJson(filePath, data) {
    return fs.writeJSON(filePath, data);
  },
  readJson(filePath) {
    return fs.readJSON(filePath);
  },
  remove(filePath) {
    return fs.remove(filePath);
  },
  resolve: path.resolve,
  pathExists(path) {
    return fs.pathExistsSync(path);
  },
  get mediaUnitsDir() {
    return this.cwd() + "/media-units";
  },
  get templatesDir() {
    return this.cwd() + "/templates";
  },
  get baseTemplateDir() {
    return path.resolve(this.templatesDir, "base");
  }
};

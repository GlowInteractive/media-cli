const fs = require("fs-extra");
const path = require("path");

module.exports = {
  directoryExists(path) {
    return fs.existsSync(path);
  },
  getMediaUnitPath(mediaUnitDirname) {
    return path.resolve(this.mediaUnitsDir, mediaUnitDirname);
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
    return this.cwd + "/media-units";
  },
  get templatesDir() {
    return path.resolve(__dirname, "../", "../", "templates");
  },
  get baseTemplateDir() {
    return path.resolve(this.templatesDir, "base");
  },
  get archivesPath() {
    return path.resolve(this.cwd, "archives");
  },
  get mediaUnitDirnames() {
    return fs.readdir(this.mediaUnitsDir);
  },
  get cwd() {
    return process.cwd();
  },
  get sharedDir() {
    return path.resolve(this.cwd, "shared");
  },
  get sharedAssetsDir() {
    return path.resolve(this.sharedDir, "assets");
  }
};

const fs = require("fs-extra");
const path = require("path");

// remove files and hidden files
const onlyDirectories = path =>
  fs.lstatSync("./").isDirectory(path.absPath) &&
  path.relativePath.charAt(0) !== ".";

module.exports = {
  directoryExists(path) {
    return fs.existsSync(path);
  },
  get generatorDirname() {
    return this.cwd + "/generators";
  },
  getGenerators() {
    return fs.readdirSync(this.generatorDirname);
  },
  getTemplateDirnames() {
    return fs.readdir(this.templatesDir);
  },
  getUserTemplateDirnames() {
    return this.directoryExists(this.userTemplatesDir)
      ? fs.readdir(this.userTemplatesDir)
      : [];
  },
  getMediaUnitDirnames() {
    return fs.readdir(this.mediaUnitsDir);
  },
  getMediaUnitPath(mediaUnitDirname) {
    return path.resolve(this.mediaUnitsDir, mediaUnitDirname);
  },
  getUserTemplatePath(userTemplateDirname) {
    return path.resolve(this.userTemplatesDir, userTemplateDirname);
  },
  getTemplatePath(templateDirname) {
    return path.resolve(this.templatesDir, templateDirname);
  },
  getTemplateEntry(templateDirname) {
    return this.getTemplatePath(templateDirname) + "/index.ejs";
  },
  getBuildPath(dirname) {
    return this.buildUnitsDir + `/${dirname}`;
  },
  write(path, data) {
    return fs.outputFile(path, data);
  },
  copy(from, to, opts) {
    return fs.copy(from, to, opts);
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
  get userTemplatesDir() {
    return this.cwd + "/templates";
  },
  get buildUnitsDir() {
    return this.cwd + "/builds";
  },
  get mediaUnitsDir() {
    return this.cwd + "/media-units";
  },
  get templatesDir() {
    return path.resolve(__dirname, "../", "templates");
  },
  get baseTemplateDir() {
    return path.resolve(this.templatesDir, "base");
  },
  get archivesPath() {
    return path.resolve(this.cwd, "archives");
  },
  get mediaUnitDirnames() {
    return fs.readdir(this.mediaUnitsDir).then(names => {
      return names
        .map(path => ({
          relativePath: path,
          absPath: this.mediaUnitsDir + `/${path}`
        }))
        .filter(onlyDirectories)
        .map(path => path.relativePath);
    });
  },
  get templateDirnames() {
    return fs.readdir(this.templatesDir).then(paths => {
      return paths
        .map(path => ({
          relativePath: path,
          absPath: this.templatesDir + `/${path}`
        }))
        .filter(onlyDirectories)
        .map(path => path.relativePath);
    });
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

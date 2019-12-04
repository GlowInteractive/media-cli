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
    fs.outputFileSync(path, data);
  },
  copy(from, to) {
    fs.copySync(from, to);
  },
  writeJson(filePath, data) {
    fs.writeJSONSync(filePath, data);
  },
  readJson(filePath) {
    return fs.readJSONSync(filePath);
  },
  remove(filePath) {
    fs.removeSync(filePath);
  },
  resolve: path.resolve
};

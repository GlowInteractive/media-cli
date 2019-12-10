const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");
const log = console.log;

const colorizeBg = str => chalk.bgMagenta.black(str);
const colorizeText = str => chalk.yellow(str);
const colorizeErr = str => chalk.redBright(str);

module.exports = {
  colorizeText,
  header() {
    clear();
    log(colorizeBg(figlet.textSync("GLOW MEDIA")));
    log("\n\n");
  },
  error(msg) {
    log(colorizeErr(msg));
  },
  log(msg = "") {
    log(colorizeText(msg));
  },
  logWithBg: str => log(colorizeBg(str))
};

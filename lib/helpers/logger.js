const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");
const log = msg =>
  console.log(boxen(msg, { padding: 1, borderColor: "magentaBright" }) + "\n");
const boxen = require("boxen");

const colorizeBg = str => chalk.bgMagenta.black(str);
const colorizeText = str => chalk.yellow(str);
const colorizeErr = str => chalk.redBright(str);

module.exports = {
  colorizeText,
  showHeader() {
    clear();
    log(colorizeBg(figlet.textSync(" GLOW ")));
  },
  error(msg) {
    log(colorizeErr(msg));
  },
  log(msg = "") {
    log(colorizeText(msg));
  },
  logWithBg: str => log(colorizeBg(str))
};

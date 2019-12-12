const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");
const log = console.log;
const boxen = require("boxen");

const colorizeBg = str => chalk.bgMagenta.black(str);
const colorizeText = str => chalk.yellow(str);
const colorizeErr = str => chalk.redBright(str);

module.exports = {
  colorizeText,
  showHeader() {
    clear();
    log(colorizeBg(figlet.textSync("GLOW-MEDIA")));
    log("\n");
  },
  error(msg) {
    log(boxen(colorizeErr(msg), { padding: 1 }));
  },
  log(msg = "") {
    log(boxen(colorizeText(msg), { padding: 1 }));
  },
  logWithBg: str =>
    log(boxen(colorizeBg(str), { padding: 1, borderColor: "magenta" }))
};

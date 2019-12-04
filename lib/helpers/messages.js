const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");
const CLI = require("clui");
const clc = require("cli-color");
const Line = CLI.Line;
const LineBuffer = CLI.LineBuffer;
const Spinner = CLI.Spinner;
const log = console.log;

const colorizeBg = str => chalk.bgYellow.black(str);
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
  countdown(msg) {
    return new Spinner(colorizeText(msg), [
      "⣾",
      "⣽",
      "⣻",
      "⢿",
      "⡿",
      "⣟",
      "⣯",
      "⣷"
    ]);
  }
};

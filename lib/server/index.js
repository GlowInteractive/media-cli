const files = require("../helpers/files");
const webpackServer = require("./webpack-setup");
const inquirer = require("inquirer");

async function getUnitToServe(message = "What unit would you like to serve?") {
  const choices = await files.mediaUnitDirnames;

  return await inquirer.prompt([
    {
      type: "list",
      choices,
      name: "dirToServe",
      message
    }
  ]);
}

module.exports = {
  async serve() {
    const response = await getUnitToServe();
    webpackServer.serve(response.dirToServe);
  },

  async build() {
    const response = await getUnitToServe("What unit would you like to build?");
    webpackServer.build(response.dirToServe);
  }
};

#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const commandType = argv._[0];
const campaignName = argv._[1];
const campaign = require("./create-campaign");
const unit = require("./create-unit");
const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");

function displayHeader() {
  console.log(
    chalk.yellow(figlet.textSync("GLOW MEDIA", { horizontalLayout: "full" }))
  );
}
clear();
displayHeader();

if (commandType === "create") {
  campaign.create(campaignName);
}

if (commandType === "create-unit") {
  unit.create();
}

#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const unit = require("./unit");
const config = require("./helpers/config");
const msg = require("./helpers/messages");
msg.header();

function createUnit(unitName) {
  unit.create(unitName).catch(handleError);
}

function handleError(err) {
  if (err == "Unit Exists") {
    msg.error(
      `\n\nThat unit already exists. Try again with another unit name.\n\n`
    );
  } else {
    msg.error(`\n\nUgh. Something unknown went wrong. Maybe try again?\n\n`);
    console.log(err);
  }

  createUnit();
}

async function handleInput(config) {
  if (argv._.includes("create") && argv.u) {
    const unitName = argv.unit || argv.u;
    createUnit(unitName);
  } else {
    msg.error("You forgot to run a command.\n\nyarn create -u {unit-name}\n\n");
  }
}

if (!config.exists()) {
  config.setup().then(handleInput);
} else {
  config.get().then(handleInput);
}

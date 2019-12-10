#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const unit = require("./unit");
const config = require("./helpers/config");
const msg = require("./helpers/messages");
msg.header();

async function handleInput() {
  if (argv._.includes("create") && argv.u) {
    const unitName = argv.unit || argv.u;
    unit.create(unitName);
  } else {
    msg.log(
      "You must command me to create something.\n\n yarn create -u {unit-name}\n\n"
    );
  }
}

if (!config.exists()) {
  config.setup().then(handleInput);
} else {
  handleInput();
}

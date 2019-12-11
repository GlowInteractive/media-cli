#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const unit = require("./unit");
const cli = require("./helpers/config");
const msg = require("./helpers/messages");
const createArchives = require("./helpers/zip-all");

msg.header();

function handleError(err) {
  let retry = () => process.exit();

  if (err.type == "unit") {
    retry = unit.create;
  } else if (err.type == "zip") {
    retry = createArchives;
  }

  msg.error(`\n\n${err.msg || err}\n\n`);
  retry();
}

async function handleInput(config) {
  if (argv._.includes("create") && argv.u) {
    const unitName = argv.unit || argv.u;
    await unit.create(unitName);
  } else if (argv._.includes("zip-all")) {
    await createArchives();
    msg.logWithBg(
      "\nArchives Created!\n\nLook at you zipping up units like a champ.\n\n"
    );
  } else {
    msg.error(
      "You forgot to run a command.\n\nPossible commands:\n\nyarn create -u {unit-name}\n\nyarn zip-all\n\n"
    );
  }
}

cli
  .setup()
  .then(handleInput)
  .catch(handleError);

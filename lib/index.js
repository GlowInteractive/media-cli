#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const unit = require("./unit");
const config = require("./helpers/config");
const logger = require("./helpers/logger");
const createArchives = require("./helpers/zip-all");
const { forgotCommand } = require("./helpers/messages");
const server = require("./server");

logger.showHeader();

function handleError(err) {
  let retry = () => process.exit();

  if (err.type == "unit") {
    retry = unit.create;
  } else if (err.type == "zip") {
    retry = createArchives;
  }

  logger.error(`\n\n${err.msg || err}\n\n`);
  retry();
}

async function handleInput() {
  if (argv["create-unit"] || argv.create) {
    await unit.create();
  } else if (argv["zip-all"] || argv.zip) {
    await createArchives();
  } else if (argv["serve"]) {
    await server.serve();
  } else if (argv["build"]) {
    await server.build();
  } else if (argv["build-all"] || argv.finish) {
    await server.buildAll();
    await createArchives();
  } else {
    logger.error(forgotCommand);
  }
}

config
  .setup()
  .then(handleInput)
  .catch(handleError);

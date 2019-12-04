#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const campaign = require("./campaign");
const unit = require("./unit");
const msg = require("./helpers/messages");
const config = require("./helpers/config");
msg.header();

if (argv._.includes("create")) {
  const campaignName = argv.campaign || argv.c;
  const unitName = argv.unit || argv.u;

  if (campaignName) {
    campaign.create(campaignName);
  } else if (unitName) {
    unit.create(unitName);
  }
} else {
  // show some helpful commands....
}

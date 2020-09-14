module.exports = {
  onArchiveCreation:
    "Archives Created!\n\nLook at you zipping up units like a champ.",
  forgotCommand:
    "Possible commands:\n\nyarn create-unit\n\nyarn serve\n\nyarn build-unit\n\nyarn build-all\n\nyarn zip-all",
  firstTime: `Looks like this is your first time here.\n\nLet's get setup.`,
  setupDone: `Okay Thanks. You're all setup.\n\nLet's get started by creating a unit.`,
  unitCreated: name =>
    `Success! Created ${name}.\n\nStart dev with yarn start!`,
  creatingArchives: `Creating Archives...`,
  archivesDone: `Archives Created.`,
  onBuildUnit: unit => `Sure. Building unit ${unit}`,
  onUnitBuilt: unit => `Ok. ${unit} unit has been built.`,
  onBuildAllUnits: `Ok. I'll build all your units for you. Feeling Lazy?`,
  onAllUnitsBuilt: `All units built. You're welcome.`
};

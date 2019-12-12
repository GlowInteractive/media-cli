module.exports = {
  onArchiveCreation:
    "\nArchives Created!\n\nLook at you zipping up units like a champ.\n\n",
  forgotCommand: "Possible commands:\n\nyarn create-unit\n\nyarn zip-all",
  firstTime: `Looks like this is your first time here.\n\nLet's get setup.`,
  setupDone: `Okay Thanks. You're all setup.`,
  unitCreated: name =>
    `\n\nSuccess! Created ${name}.\n\nServe it with yarn start -u ${name}\n\n`
};

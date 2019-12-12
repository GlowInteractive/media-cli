module.exports = {
  onArchiveCreation:
    "\nArchives Created!\n\nLook at you zipping up units like a champ.\n\n",
  forgotCommand:
    "You forgot to run a command.\n\nPossible commands:\n\nyarn create -u {unit-name}\n\nyarn zip-all\n",
  firstTime: `Looks like this is your first time running this command.\n\nLet's get setup.\n\n`,
  setupDone: `\nOkay Thanks. You're all setup.\nLet's create your first unit.\n`,
  unitCreated: name =>
    `\n\nSuccess! Created ${name}.\n\nServe it with yarn start -u ${name}\n\n`
};

const logger = require("../helpers/logger");

module.exports = (name = false) => {
  return [
    {
      type: "input",
      name: "name",
      message: logger.colorizeText("Enter Media Unit Name."),
      suffix: " ie: 300x250_v1",
      when: !name,
      validate: input => (!!input ? true : "Media Unit Name is required.")
    },
    {
      name: "size",
      type: "list",
      choices: ["300x250", "970x250", "300x600", "728x90", "970x90"],
      message: logger.colorizeText("Enter Media Unit Size."),
      validate: input => (!!input ? true : "Size is required.")
    },
    {
      type: "input",
      name: "exitLink",
      message: logger.colorizeText("Enter Default Exit Link"),
      default: "Visit Site"
    }
  ];
};

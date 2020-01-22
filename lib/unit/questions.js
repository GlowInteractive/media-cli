const logger = require("../helpers/logger");
const changeCase = require("change-case");

module.exports = templates => {
  return [
    {
      type: "input",
      name: "name",
      message: logger.colorizeText("Enter Media Unit Name."),
      validate: input => (!!input ? true : "Media Unit Name is required."),
      filter: function(input) {
        return changeCase.snakeCase(input);
      }
    },
    {
      name: "size",
      type: "list",
      choices: ["300x250", "970x250", "300x600", "728x90", "970x90", "160x600"],
      message: logger.colorizeText("Enter Media Unit Size."),
      validate: input => (!!input ? true : "Size is required.")
    },
    {
      type: "list",
      name: "template",
      message: logger.colorizeText("Choose a unit template."),
      choices: templates,
      filter: function(name) {
        return changeCase.noCase(name);
      }
    }
  ];
};

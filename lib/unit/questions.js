const logger = require("../helpers/logger");
const { snakeCase } = require("snake-case");

module.exports = templates => {
  return [
    // {
    //   name: "template",
    //   type: "list",
    //   choices: templates,
    //   message: logger.colorizeText(
    //     "What template would you like to start with?"
    //   ),
    //   validate: function (input) {
    //     return !!input ? true : "A Template is required.";
    //   }
    // },
    {
      type: "input",
      name: "name",
      message: logger.colorizeText("Enter Media Unit Name."),
      validate: function (input) {
        return !!input ? true : "Media Unit Name is required.";
      },
      filter: function (input) {
        return snakeCase(input);
      }
    },
    {
      name: "size",
      type: "list",
      choices: ["300x250", "970x250", "300x600", "728x90", "970x90"],
      message: logger.colorizeText("Enter Media Unit Size."),
      validate: function (input) {
        return !!input ? true : "Size is required.";
      }
    },
    {
      type: "input",
      name: "exitLink",
      message: logger.colorizeText("Enter Default Exit Link"),
      default: "Visit Site"
    }
  ];
};

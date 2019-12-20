const logger = require("../helpers/logger");
const { snakeCase } = require("snake-case");

module.exports = () => {
  return [
    {
      type: "input",
      name: "name",
      message: logger.colorizeText("Enter Media Unit Name."),
      validate: input => (!!input ? true : "Media Unit Name is required."),
      filter: function(input) {
        return snakeCase(input);
      }
    },
    {
      name: "size",
      type: "list",
      choices: ["300x250", "970x250", "300x600", "728x90", "970x90"],
      message: logger.colorizeText("Enter Media Unit Size."),
      validate: input => (!!input ? true : "Size is required.")
    },
    {
      type: "checkbox",
      name: "componentList",
      message: logger.colorizeText(
        "Select any components you'd like included."
      ),
      choices: [
        "background-video",
        "trailer-video",
        "story",
        "lockup",
        "cta-button"
      ]
    }
  ];
};

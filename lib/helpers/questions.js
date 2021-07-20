const logger = require("./logger");

module.exports = function (campaignName) {
  return [
    {
      type: "input",
      name: "campaignName",
      message: logger.colorizeText(
        "What would you like to call this campaign?"
      ),
      default: campaignName,
      validate: function (input) {
        return !!input ? true : "Campaign Name is required.";
      }
    },
    {
      type: "input",
      name: "client",
      message: logger.colorizeText("Who is the client?"),
      validate: function (input) {
        return !!input ? true : "Client is required.";
      }
    },
    {
      type: "confirm",
      name: "useEnabler",
      default: true,
      message: logger.colorizeText(
        "Will you be using Enabler for this campaign?"
      )
    },
    {
      type: "input",
      name: "exitLink",
      message: logger.colorizeText("Enter your exit link or click-tag.")
    }
  ];
};

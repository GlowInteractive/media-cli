const msg = require("../helpers/messages");

module.exports = [
  {
    type: "input",
    name: "client",
    message: msg.colorizeText("Who is the client?"),
    validate: function(input) {
      return !!input ? true : "Client is required.";
    }
  },
  {
    type: "input",
    name: "premiereDate",
    message: msg.colorizeText("Enter Premiere Date if applicable."),
    suffix: " ie: Dec 8, Oct 10.."
  }
];

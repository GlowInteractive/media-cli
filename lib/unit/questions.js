const msg = require("../helpers/messages");

module.exports = (name = false) => {
  return [
    {
      type: "input",
      name: "name",
      message: msg.colorizeText("Enter Media Unit Name."),
      suffix: " ie: 300x250_v1",
      when: !name,
      validate: function(input) {
        return !!input ? true : "Media Unit Name is required.";
      }
    },
    {
      type: "input",
      name: "size",
      message: msg.colorizeText("Enter Media Unit Size."),
      suffix: " 300x250, 970x250, etc...",
      validate: function(input) {
        return !!input ? true : "Size is required.";
      }
    },
    {
      type: "input",
      name: "exitLink",
      message: msg.colorizeText("Enter Default Exit Link"),
      default: "Visit Site"
    }
  ];
};

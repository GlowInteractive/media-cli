const replaceString = require("replace-string");

// replace any test-date attributes
// to prevent from being deployed to prod

module.exports = function (source) {
  source = replaceString(source, "test-date", "data-test");

  return source;
};

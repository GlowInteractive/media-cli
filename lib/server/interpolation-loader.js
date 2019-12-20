const replaceString = require("replace-string");

// replace any lodash template delimiters with
// es6 string interpolation so html-loader
// can it correctly.

module.exports = function(source) {
  const delimiterStart = "<%=";
  const delimiterEnd = "%>";
  source = replaceString(source, delimiterStart, "${");
  source = replaceString(source, delimiterEnd, "}");

  return source;
};

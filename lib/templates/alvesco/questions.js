module.exports = [
  {
    name: "size",
    type: "list",
    choices: ["300x250", "970x250", "300x600", "728x90", "970x90"],
    message: "Enter Media Unit Size.",
    validate: function (input) {
      return !!input ? true : "Size is required.";
    }
  },
  {
    name: "copyOne",
    type: "input",
    message: "Input Frame 1 Copy"
  }
  // {
  //   name: "copyTwo",
  //   type: "input",
  //   message: "Input Frame 2 Copy"
  // },
  // {
  //   name: "copyThree",
  //   type: "input",
  //   message: "Input Frame 3 Copy"
  // },
  // {
  //   name: "copyFour",
  //   type: "input",
  //   message: "Input Frame 4 Copy"
  // },
  // {
  //   name: "ctaCopy",
  //   type: "input",
  //   message: "Input CTA Copy"
  // }
];

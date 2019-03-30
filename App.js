let build = require("./buildDb");
let customer = require("./bamazonCustomer");
// let manager = require("./bamazonManager");
// let supervisor = require("./bamazonSupervisor");
let inquirer = require("inquirer");

function bamazon() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which profile would you like to view?",
        choices: ["Customer", "Manager", "Supervisor"],
        name: "view",
        default: "Customer"
      }
    ])
    .then(response => {
      switch (response.view) {
        case "Customer":
          customer();
          break;
        case "Manager":
          break;
        case "Supervisor":
          break;
        default:
          customer();
          break;
      }
    });
}

build();
bamazon();

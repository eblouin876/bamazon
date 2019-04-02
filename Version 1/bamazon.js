let customer = require("./bamazonCustomer");
let manager = require("./bamazonManager");
let supervisor = require("./bamazonSupervisor");
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
    .then(async response => {
      switch (response.view) {
        case "Customer":
          await customer();
          break;
        case "Manager":
          manager();
          break;
        case "Supervisor":
          supervisor();
          break;
        default:
          customer();
          break;
      }
    });
}

bamazon();

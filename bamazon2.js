let customer = require("./customer2");
let manager = require("./manager2");
let supervisor = require("./supervisor2");
let inquirer = require("inquirer");

function bamazon() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which profile would you like to view?",
        choices: ["Customer", "Manager", "Supervisor", "Quit"],
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
          await manager();
          break;
        case "Supervisor":
          await supervisor();
          break;
        case "Quit":
          return;
        default:
          await bamazon();
          break;
      }
      bamazon();
    });
}

bamazon();

let query = require("./query");
let inquirer = require("inquirer");

async function manager() {
  return new Promise(async (resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
          ]
        }
      ])
      .then(async resp => {
        switch (resp.choice) {
          case "View Products for Sale":
            viewProducts();
            break;
          case "View Low Inventory":
            viewLow();
            break;
          case "Add to Inventory":
            addInventory();
            break;
          case "Add New Product":
            addProduct();
            break;
          case "Quit":
            resolve();
            break;
          default:
            manager();
            break;
        }
      });
  });
}

async function viewProducts() {
  let results = await query("SELECT * FROM bamazon_db.products");
  console.table(results);
  manager();
}

async function viewLow() {
  let results = await query("SELECT * FROM bamazon_db.products");
  let low = results.filter(item => item.stock_quantity < 5);
  console.table(low);
  manager();
}

async function addInventory() {
  let results = await query("SELECT * FROM bamazon_db.products");
  console.table(results);
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the id of the item you would like to restock?",
        validate: input => {
          if (input <= results.length) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(stockId => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "amount",
            message: "Enter the amount of the item you would like to restock?"
          }
        ])
        .then(async stockAmount => {
          await query(
            `UPDATE bamazon_db.products SET stock_quantity = stock_quantity + ${parseInt(
              stockAmount.amount
            )} WHERE id = ${stockId.id}`
          );
          console.log(`${stockAmount.amount} added to stock!`);
          console.table(
            await query(
              `SELECT * FROM bamazon_db.products WHERE id = ${stockId.id}`
            )
          );
          manager();
        });
    });
}

async function addProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Enter the name of the item you would like to add?",
        validate: input => {
          if (input.length > 2) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "department_name",
        message: "Enter the department name of the item you would like to add?",
        validate: input => {
          if (input.length > 2) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "price",
        message: "Enter the price of the item you would like to add?",
        validate: input => {
          if (typeof parseFloat(input) === "number" && parseFloat(input) > 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "Enter the quantity of the item you would like to add?",
        validate: input => {
          if (typeof parseFloat(input) === "number" && parseFloat(input) > 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(async response => {
      let product = `("${response.product_name}", "${
        response.department_name
      }", ${response.price}, ${response.stock_quantity})`;
      await query(
        `INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity) VALUES ${product}`
      );
      console.log(
        `${response.product_name} was successfully added to the stock!`
      );
      manager();
    });
}

module.exports = manager;

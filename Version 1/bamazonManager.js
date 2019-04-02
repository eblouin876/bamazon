let mysql = require("mysql");
require("dotenv").config();
let inquirer = require("inquirer");

function manager() {
  let con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  con.connect(err => {
    if (err) console.log(err);

    con.query("SELECT * FROM bamazon_db.products", (err, results, fields) => {
      if (err) console.log(err);
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
        .then(resp => {
          if (resp.choice === "View Products for Sale") {
            console.table(results);
            con.end();
            manager();
          } else if (resp.choice === "View Low Inventory") {
            let low = results.filter(item => item.stock_quantity < 5);
            console.table(low);
            con.end();
            manager();
          } else if (resp.choice === "Add to Inventory") {
            console.table(results);
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "id",
                  message:
                    "Enter the id of the item you would like to restock?",
                  validate: input => {
                    if (input <= results.length) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }
              ])
              .then(response => {
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "amount",
                      message:
                        "Enter the amount of the item you would like to restock?"
                    }
                  ])
                  .then(val => {
                    let object = results.filter(
                      item => item.id === parseInt(response.id)
                    )[0];
                    con.query(
                      `UPDATE bamazon_db.products SET stock_quantity = ${parseInt(
                        object.stock_quantity
                      ) + parseInt(val.amount)} WHERE id = ${object.id}`
                    );
                    con.query(
                      `SELECT * FROM bamazon_db.products WHERE id = ${
                        object.id
                      }`,
                      (err, results) => {
                        console.log(
                          `\n${val.amount} added to ${
                            object.product_name
                          } stock.`
                        );
                        console.table(results);
                        console.log("\n");
                        con.end();
                        manager();
                      }
                    );
                  });
              });
          } else if (resp.choice === "Add New Product") {
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
                  message:
                    "Enter the department name of the item you would like to add?",
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
                    if (
                      typeof parseFloat(input) === "number" &&
                      parseFloat(input) > 0
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                },
                {
                  type: "input",
                  name: "stock_quantity",
                  message:
                    "Enter the quantity of the item you would like to add?",
                  validate: input => {
                    if (
                      typeof parseFloat(input) === "number" &&
                      parseFloat(input) > 0
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }
              ])
              .then(response => {
                let product = `("${response.product_name}", "${
                  response.department_name
                }", ${response.price}, ${response.stock_quantity})`;
                con.query(
                  `INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity) VALUES ${product}`,
                  (err, results) => {
                    if (err) console.log(err);
                    console.log(
                      `${
                        response.product_name
                      } was successfully added to the stock!`
                    );
                    con.end();
                    manager();
                  }
                );
              });
          } else if (resp.choice === "Quit") {
            con.end();
            return;
          }
        });
    });
  });
}

module.exports = manager;

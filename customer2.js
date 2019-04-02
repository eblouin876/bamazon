let query = require("./query");
let inquirer = require("inquirer");

async function customer() {
  return new Promise(async (resolve, reject) => {
    let results = await query("SELECT * FROM bamazon_db.products");
    console.table(results);
    inquirer
      .prompt([
        {
          type: "input",
          name: "item",
          message: "Please input the id of the item you would like to purchase",
          validate: input => {
            if (input <= results.length) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(resp => {
        let object = results.find(item => item["id"] === parseInt(resp.item));
        if (object.stock_quantity > 0) {
          console.log(
            `Great! There are ${object.stock_quantity} ${
              object.product_name
            } available.`
          );
          inquirer
            .prompt([
              {
                type: "input",
                name: "num",
                message: "How many would you like to buy?",
                validate: input => {
                  if (input <= object.stock_quantity) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }
            ])
            .then(async result => {
              let cost = object.price * result.num;
              console.log(
                `That will be $${cost.toFixed(2)}. Thank you for your purchase!`
              );
              query(
                `UPDATE bamazon_db.products SET stock_quantity = stock_quantity -
                  ${result.num} WHERE id = ${resp.item}`
              );
              let department = await query(
                `SELECT * from bamazon_db.departments WHERE department_name = "${
                  object.department_name
                }"`
              );

              query(
                `UPDATE bamazon_db.departments SET product_sales = ${(department[0].product_sales += cost)} WHERE department_name = "${
                  department[0].department_name
                }"`
              );

              inquirer
                .prompt([
                  {
                    type: "confirm",
                    name: "again",
                    message: "Would you like to buy something else?"
                  }
                ])
                .then(conf => {
                  if (conf.again) {
                    customer();
                  } else {
                    console.log("Thank you for your business!");
                    resolve();
                  }
                });
            });
        } else {
          console.log("Sorry, we are out of that item.");
          customer();
        }
      });
  });
}

module.exports = customer;

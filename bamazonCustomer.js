let mysql = require("mysql");
require("dotenv").config();
let inquirer = require("inquirer");

function customer() {
  let con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  con.connect(err => {
    if (err) console.log(err);

    con.query("SELECT * FROM bamazon_db.products", (err, results, fields) => {
      if (err) console.log(err);
      console.table(results);
      inquirer
        .prompt([
          {
            type: "input",
            name: "item",
            message:
              "Please input the id of the item you would like to purchase",
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
              .then(result => {
                console.log(
                  `That will be $${(object.price * result.num).toFixed(
                    2
                  )}. Thank you for your purchase!`
                );
                con.query(
                  `UPDATE bamazon_db.products SET stock_quantity = ${object.stock_quantity -
                    result.num} WHERE id = ${object.id}`
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
                      con.end();
                      console.log("Thank you for your business!");
                      return;
                    }
                  });
              });
          } else {
            console.log("Sorry, we are out of that item.");
            customer();
          }
        });
    });
  });
}

module.exports = customer;

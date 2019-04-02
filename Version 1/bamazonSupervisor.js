let mysql = require("mysql");
require("dotenv").config();
let inquirer = require("inquirer");

function supervisor() {
  let con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  con.connect(err => {
    if (err) console.log(err);
    con.query("SELECT * FROM bamazon_db.products", (err, products, fields) => {
      if (err) console.log(err);
      con.query(
        "SELECT * FROM bamazon_db.departments",
        (err, departments, fields) => {
          if (err) console.log(err);

          inquirer
            .prompt([
              {
                type: "list",
                name: "choice",
                message: "What would you like to do",
                choices: [
                  "View Product Sales by Department",
                  "Create a New Department",
                  "Quit"
                ]
              }
            ])
            .then(results => {
              if (results.choice === "View Product Sales by Department") {
                for (key in departments) {
                  let obj = departments[key];
                  obj.total_profit = parseFloat(
                    (obj.product_sales - obj.over_head_costs).toFixed(2)
                  );
                }
                console.table(departments);
                con.end();
                supervisor();
              } else if (results.choice === "Create a New Department") {
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "name",
                      message: "What department would you like to add?"
                    },
                    {
                      type: "input",
                      name: "cost",
                      message:
                        "What are the overhead costs for this department?",
                      validate: input => {
                        if (typeof parseInt(input) > 0) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    },
                    {
                      type: "input",
                      name: "sales",
                      message:
                        "What are the to date product sales for this department?",
                      validate: input => {
                        if (typeof parseInt(input) > 0) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    }
                  ])
                  .then(res => {
                    let newDepartment = `("${res.name}","${res.cost}","${
                      res.sales
                    }")`;
                    con.query(
                      `INSERT INTO bamazon_db.departments (department_name, over_head_costs, product_sales) VALUES ${newDepartment}`
                    );
                    console.log(`${res.name} has been added to the database`);
                    con.end();
                    supervisor();
                  });
              } else if (results.choice === "Quit") {
                con.end();
                return;
              }
            });
        }
      );
    });
  });
}

module.exports = supervisor;

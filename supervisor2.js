let query = require("./query");
let inquirer = require("inquirer");

function supervisor() {
  return new Promise(async (resolve, reject) => {
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
          viewSales();
        } else if (results.choice === "Create a New Department") {
          createDept();
        } else if (results.choice === "Quit") {
          resolve();
        }
      });
  });
}

async function viewSales() {
  let departments = await query("SELECT * FROM bamazon_db.departments");
  for (key in departments) {
    let obj = departments[key];
    obj.total_profit = parseFloat(
      (obj.product_sales - obj.over_head_costs).toFixed(2)
    );
  }
  console.table(departments);
  supervisor();
}

async function createDept() {
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
        message: "What are the overhead costs for this department?",
        validate: input => {
          if (parseInt(input) > 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "sales",
        message: "What are the to date product sales for this department?",
        validate: input => {
          if (parseInt(input) > 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(res => {
      let newDepartment = `("${res.name}","${res.cost}","${res.sales}")`;
      query(
        `INSERT INTO bamazon_db.departments (department_name, over_head_costs, product_sales) VALUES ${newDepartment}`
      );
      console.log(`${res.name} has been added to the database`);
      supervisor();
    });
}

module.exports = supervisor;

let mysql = require("mysql");
require("dotenv").config();
let products = require("./products");

function buildDB() {
  let con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  con.connect(err => {
    if (err) console.log(err);

    build("DROP DATABASE IF EXISTS bamazon_db");

    build("CREATE DATABASE bamazon_db");

    build("USE bamazon_db");

    let makeTable = ` create table if not exists products(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        product_name VARCHAR(30) NOT NULL,
        department_name VARCHAR(30) NOT NULL,
        price FLOAT NOT NULL,
        stock_quantity INT NOT NULL
    )`;

    build(makeTable);

    build(
      `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ${products}`
    );

    con.end(err => {
      if (err) console.log(err);
    });
  });

  function build(command) {
    con.query(command, err => {
      if (err) console.log(err);
    });
  }
}

module.exports = buildDB;

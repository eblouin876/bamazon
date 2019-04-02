let mysql = require("mysql");
require("dotenv").config();

function query(command) {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    connection.connect(async err => {
      if (err) throw err;
      connection.query(command, (err, results) => {
        if (results) resolve(results);
        reject(err);
      });
      connection.end();
    });
  });
}
module.exports = query;

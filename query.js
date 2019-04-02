let mysql = require("mysql");

function query(command) {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: user,
      password: pwd
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

const mysql = require("mysql");
const { queryProducts, queryStore, queryUsers } = require("../queries/query");

const task = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NewWorldJinx0629",
  insecureAuth : true
});

// connect to database

task.connect((err) => {
  if (err) {
    console.log(`Error => ${err.stack}`);
    return;
  }
  console.log(`Connected to server...`);
});

// create database

const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS task CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci`;

task.query(createDatabaseQuery, (err, result, fields) => {
  if (err) {
    console.log(`Error => ${err.message}`);
  } else {
    console.log(`created database successfully...`);
  }
});

task.changeUser({ database: "task" }, (err) => {
  if (err) {
    console.log("error : ", err);
  } else {
    console.log(`database successfully selected...`);
  }
});

task.query(queryUsers, (err, rows) => {
  if (err) throw err;
  console.log(`successfully created table - users`);
});

task.query(queryStore, (err, rows) => {
  if (err) throw err;
  console.log(`successfully created table - store`);
});

task.query(queryProducts, (err, rows) => {
  if (err) throw err;
  console.log(`successfully created table - products`);
});

module.exports = task;

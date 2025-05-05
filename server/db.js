// server/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Greenarcher04',
  database: 'baseball_db',
});

module.exports = pool.promise();

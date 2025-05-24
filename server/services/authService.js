// authService.js
const db = require('../db');

exports.createUser = (username, hash, cb) => {
  const query = `
    START TRANSACTION;
    INSERT INTO user (username, password) VALUES (?, ?);
    COMMIT;
  `;
  db.query(query, [username, hash], cb);
};

exports.findUserByUsername = (username, cb) => {
  db.query('SELECT * FROM user WHERE username = ?', [username], cb);
};

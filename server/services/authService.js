const db = require('../db');

exports.createUser = (username, hash, cb) => {
  db.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hash], cb);
};

exports.findUserByUsername = (username, cb) => {
  db.query('SELECT * FROM user WHERE username = ?', [username], cb);
};

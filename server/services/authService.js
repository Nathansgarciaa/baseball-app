// Import the database connection
const db = require('../db');

// 📌 Function: Create a new user account
// This inserts a new user with a hashed password into the database
exports.createUser = (username, hash, cb) => {
  const query = `
    START TRANSACTION;
    INSERT INTO user (username, password) VALUES (?, ?);
    COMMIT;
  `;
  // Execute the SQL query with provided username and hashed password
  db.query(query, [username, hash], cb);
};

// 📌 Function: Find a user by their username
// Used during login to check if the user exists and get their hashed password
exports.findUserByUsername = (username, cb) => {
  db.query('SELECT * FROM user WHERE username = ?', [username], cb);
};

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');
// Import functions from the authentication service (handles DB logic)
const authService = require('../services/authService');

// Controller function to handle user signup
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the plain text password using bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Save the new user with hashed password in the database
    authService.createUser(username, hash, (err, result) => {
      if (err) {
        // If there’s a DB error
        return res.status(500).json({ message: 'Error creating user' });
      }

      // Success response
      res.status(201).json({ message: 'User created' });
    });

  } catch {
    // If hashing fails for any reason
    res.status(500).json({ message: 'Password encryption failed' });
  }
};

// Controller function to handle user login
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Look up the user in the database by username
  authService.findUserByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      // No user found or DB error
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare entered password with the stored hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // If passwords do not match
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If valid, return user info (but not the password) to the frontend
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        username: user.username
      }
    });
  });
};

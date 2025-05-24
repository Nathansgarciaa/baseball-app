const bcrypt = require('bcrypt');
const authService = require('../services/authService');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    authService.createUser(username, hash, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User created' });
    });
  } catch {
    res.status(500).json({ message: 'Password encryption failed' });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  authService.findUserByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Incorrect password' });

    // ✅ Return user_id and username so frontend can store it
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        username: user.username
      }
    });
  });
};

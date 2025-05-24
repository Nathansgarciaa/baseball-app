// Import Express and create a router object
const express = require('express');
const router = express.Router();

// Import the auth controller which contains signup and login logic
const authController = require('../controllers/authController'); // ✅ Make sure this path is correct

// Route to handle user signup
// Example: POST /auth/signup
router.post('/signup', authController.signup);

// Route to handle user login
// Example: POST /auth/login
router.post('/login', authController.login);

// Export the router so it can be used in app.js or server.js
module.exports = router;

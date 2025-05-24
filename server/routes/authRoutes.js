const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Make sure this path is correct

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

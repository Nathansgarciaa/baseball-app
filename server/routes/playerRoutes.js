// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Add a player to a team
router.post('/team/:id/players', playerController.addPlayer);

// Get all players on a team
router.get('/team/:id/players', playerController.getPlayers);

module.exports = router;

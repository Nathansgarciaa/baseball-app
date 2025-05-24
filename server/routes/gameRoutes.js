// Import Express and create a router instance
const express = require('express');
const router = express.Router();

// Import the game controller that contains all route logic
const gameController = require('../controllers/gameController');

// 📌 Route: Add a new game for a specific team
// Endpoint: POST /games/team/:id/games
// Description: Adds a game where :id is the current team ID (home or away)
router.post('/team/:id/games', gameController.addGame);

// 📌 Route: Get all games for a specific team
// Endpoint: GET /games/team/:id/games
router.get('/team/:id/games', gameController.getGamesByTeam);

// 📌 Route: Get all players involved in a specific game
// Endpoint: GET /games/:id/players
router.get('/:id/players', gameController.getPlayersForGame);

// 📌 Route: Update a stat (like hits, home_runs) for a player in a game
// Endpoint: POST /games/:id/stat
router.post('/:id/stat', gameController.updatePlayerStat);

// 📌 Route: Get all stats for a specific game
// Endpoint: GET /games/:id/stats
router.get('/:id/stats', gameController.getGameStats);

// Export the router so it can be used in your main app file
module.exports = router;

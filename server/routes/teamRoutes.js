// Import Express and create a router instance
const express = require('express');
const router = express.Router();

// Import the team controller that handles the logic for each route
const teamController = require('../controllers/teamController');

// 📌 Route: Get a list of all teams
// Endpoint: GET /team/
router.get('/', teamController.getAllTeams);

// 📌 Route: Create a new team
// Endpoint: POST /team/
// Body should include: team_name, city_name, state, coach_user_id
router.post('/', teamController.createTeam);

// 📌 Route: Get all teams created by a specific coach (user)
// Endpoint: GET /team/user/:id
router.get('/user/:id', teamController.getTeamsByCoach);

// 📌 Route: Get all players on a team with their stats
// Endpoint: GET /team/:id/players-with-stats
router.get('/:id/players-with-stats', teamController.getPlayersWithStats);

// Export this router to be used in the main app file
module.exports = router;

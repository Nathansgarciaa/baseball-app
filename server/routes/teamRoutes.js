const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllTeams);
router.post('/', teamController.createTeam);

router.get('/:id/players-with-stats', teamController.getPlayersWithStats);


module.exports = router;


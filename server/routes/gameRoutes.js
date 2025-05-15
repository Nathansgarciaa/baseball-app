const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/team/:id/games', gameController.addGame);
router.get('/team/:id/games', gameController.getGamesByTeam);

module.exports = router;

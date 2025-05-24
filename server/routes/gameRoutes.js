const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/team/:id/games', gameController.addGame);
router.get('/team/:id/games', gameController.getGamesByTeam);
router.get('/:id/players', gameController.getPlayersForGame);
router.post('/:id/stat', gameController.updatePlayerStat);
router.get('/:id/stats', gameController.getGameStats);




module.exports = router;

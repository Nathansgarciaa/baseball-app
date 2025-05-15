const gameService = require('../services/gameService');
const teamService = require('../services/teamService');

exports.addGame = (req, res) => {
  const userTeamId = parseInt(req.params.id);
  const { game_date, location, opponent_name, opponent_city, opponent_state, role } = req.body;

  if (![1, 2].includes(role)) {
    return res.status(400).json({ error: 'Invalid team role (1 = home, 2 = away)' });
  }

  teamService.findTeam(opponent_name, opponent_city, opponent_state, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to check opponent' });

    const proceed = (opponentId) => {
      const home_team_id = role === 1 ? userTeamId : opponentId;
      const away_team_id = role === 1 ? opponentId : userTeamId;

      gameService.addGame(game_date, home_team_id, away_team_id, location, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert game' });
        res.status(201).json({ message: 'Game created', game_id: result.insertId });
      });
    };

    if (rows.length > 0) {
      proceed(rows[0].team_id);
    } else {
      teamService.addOpponentTeam(opponent_name, opponent_city, opponent_state, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert opponent team' });
        proceed(result.insertId);
      });
    }
  });
};

exports.getGamesByTeam = (req, res) => {
  const teamId = parseInt(req.params.id);
  gameService.getGamesByTeamId(teamId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch games' });
    res.json(results);
  });
};

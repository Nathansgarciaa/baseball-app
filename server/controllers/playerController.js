const playerService = require('../services/playerService');

exports.addPlayer = (req, res) => {
  const team_id = parseInt(req.params.id);
  const { first_name, last_name, position } = req.body;
  const age = parseInt(req.body.age); 

  playerService.addPlayerToTeam(team_id, first_name, last_name, position, age, (err, result) => {
    if (err) {
      console.error('❌ Failed to add player:', err); // ✅ debug log
      return res.status(500).json({ error: 'Insert player failed' });
    }
    res.status(201).json({ message: 'Player added', player_id: result.insertId });
  });
};


exports.getPlayers = (req, res) => {
  const team_id = parseInt(req.params.id);
  playerService.getPlayersByTeamId(team_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch players failed' });
    res.json(results);
  });
};

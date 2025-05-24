// Import the player service which contains database logic
const playerService = require('../services/playerService');

// Controller to add a new player to a team
exports.addPlayer = (req, res) => {
  const team_id = parseInt(req.params.id); // Get the team ID from the URL
  const { first_name, last_name, position } = req.body; // Extract fields from the request body
  const age = parseInt(req.body.age); // Ensure age is an integer

  // Use the service to add the player to the team
  playerService.addPlayerToTeam(team_id, first_name, last_name, position, age, (err, result) => {
    if (err) {
      console.error('❌ Failed to add player:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Insert player failed' }); // Respond with error
    }

    // Respond with success and new player's ID
    res.status(201).json({ message: 'Player added', player_id: result.insertId });
  });
};

// Controller to get all players for a specific team
exports.getPlayers = (req, res) => {
  const team_id = parseInt(req.params.id); // Get team ID from the URL

  // Use the service to fetch players
  playerService.getPlayersByTeamId(team_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Fetch players failed' }); // Respond with error
    }

    // Respond with list of players
    res.json(results);
  });
};

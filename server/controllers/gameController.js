const gameService = require('../services/gameService'); // Handles DB logic for games
const teamService = require('../services/teamService'); // Handles DB logic for teams

// Adds a new game between the current team and an opponent
exports.addGame = (req, res) => {
  const userTeamId = parseInt(req.params.id); // ID of the current user's team
  const { game_date, location, opponent_name, opponent_city, opponent_state, role } = req.body;

  // Role must be 1 (home) or 2 (away)
  if (![1, 2].includes(role)) {
    return res.status(400).json({ error: 'Invalid team role (1 = home, 2 = away)' });
  }

  // Check if the opponent team already exists
  teamService.findTeam(opponent_name, opponent_city, opponent_state, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to check opponent' });

    // Reusable function to insert the game after getting opponent team ID
    const proceed = (opponentId) => {
      const home_team_id = role === 1 ? userTeamId : opponentId;
      const away_team_id = role === 1 ? opponentId : userTeamId;

      gameService.addGame(game_date, home_team_id, away_team_id, location, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert game' });
        res.status(201).json({ message: 'Game created', game_id: result.insertId });
      });
    };

    // If the team already exists, use it
    if (rows.length > 0) {
      proceed(rows[0].team_id);
    } else {
      // Otherwise, create the opponent team first
      teamService.addOpponentTeam(opponent_name, opponent_city, opponent_state, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert opponent team' });
        proceed(result.insertId);
      });
    }
  });
};

// Get all games that involve a specific team
exports.getGamesByTeam = (req, res) => {
  const teamId = parseInt(req.params.id);
  gameService.getGamesByTeamId(teamId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch games' });
    res.json(results);
  });
};

// Get players who participated in a specific game (raw query version)
exports.getPlayersByGameId = (req, res) => {
  const gameId = req.params.id;
  const query = `
    SELECT p.player_id, p.first_name, p.last_name, p.position
    FROM player p
    JOIN team t ON p.team_id = t.team_id
    JOIN game g ON (g.home_team_id = t.team_id OR g.away_team_id = t.team_id)
    WHERE g.game_id = ?
  `;
  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching players:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Get players for a game using a service abstraction (cleaner)
exports.getPlayersForGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const players = await gameService.fetchPlayersForGame(gameId);
    res.json(players);
  } catch (err) {
    console.error('❌ Error in controller:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a specific stat (like "hits", "home_runs", etc.) for a player in a game
exports.updatePlayerStat = async (req, res) => {
  try {
    const { game_id, player_id, stat_type } = req.body;
    await gameService.incrementPlayerStat(game_id, player_id, stat_type);
    res.json({ message: 'Stat updated' });
  } catch (err) {
    console.error('❌ Error updating stat:', err);
    res.status(500).json({ error: 'Failed to update stat' });
  }
};

// Get all player stats for a given game
exports.getGameStats = (req, res) => {
  const gameId = parseInt(req.params.id);
  console.log("📊 Fetching stats for game ID:", gameId);

  gameService.fetchStatsByGameId(gameId, (err, data) => {
    if (err) {
      console.error("❌ Error fetching stats:", err);
      return res.status(500).json({ error: 'Failed to get stats' });
    }
    res.json(data);
  });
};

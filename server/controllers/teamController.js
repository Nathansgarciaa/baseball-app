// Import team-related database logic from the service layer
const teamService = require('../services/teamService');

// Controller: Get all teams in the database
exports.getAllTeams = (req, res) => {
  teamService.getAllTeams((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' }); // Internal error
    res.json(results); // Send all team data as JSON
  });
};

// Controller: Create a new team
exports.createTeam = (req, res) => {
  const { team_name, city_name, state, coach_user_id } = req.body;

  // Require a coach_user_id to assign the team to a user
  if (!coach_user_id) {
    return res.status(400).json({ error: 'Missing coach_user_id' });
  }

  // Add the team via service function
  teamService.addTeam(team_name, city_name, state, coach_user_id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });

    // Send confirmation with new team ID
    res.status(201).json({ message: 'Team created', team_id: result.insertId });
  });
};

// Controller: Get all teams that belong to a specific coach (by user ID)
exports.getTeamsByCoach = (req, res) => {
  const coachUserId = parseInt(req.params.id);

  teamService.getTeamsByCoach(coachUserId, (err, teams) => {
    if (err) {
      console.error('❌ Failed to get user’s teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }

    // Send teams as response
    res.json(teams);
  });
};

// Controller: Get all players on a team along with their stats
exports.getPlayersWithStats = async (req, res) => {
  const teamId = parseInt(req.params.id);
  try {
    const players = await teamService.fetchPlayersWithStats(teamId);
    res.json(players); // Return players with their stat lines
  } catch (err) {
    console.error('Failed to fetch roster with stats:', err);
    res.status(500).json({ error: 'Failed to fetch roster with stats' });
  }
};

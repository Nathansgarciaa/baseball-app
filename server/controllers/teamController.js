const teamService = require('../services/teamService');

exports.getAllTeams = (req, res) => {
  teamService.getAllTeams((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

exports.createTeam = (req, res) => {
  const { team_name, city_name, state, coach_user_id } = req.body;
  if (!coach_user_id) return res.status(400).json({ error: 'Missing coach_user_id' });

  teamService.addTeam(team_name, city_name, state, coach_user_id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.status(201).json({ message: 'Team created', team_id: result.insertId });
  });
};

exports.getPlayersWithStats = async (req, res) => {
  const teamId = parseInt(req.params.id);
  try {
    const players = await teamService.fetchPlayersWithStats(teamId);
    res.json(players);
  } catch (err) {
    console.error('Failed to fetch roster with stats:', err);
    res.status(500).json({ error: 'Failed to fetch roster with stats' });
  }
};
exports.getTeamsByCoach = (req, res) => {
  const coachUserId = parseInt(req.params.id);

  teamService.getTeamsByCoach(coachUserId, (err, teams) => {
    if (err) {
      console.error('❌ Failed to get user’s teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
    res.json(teams);
  });
};

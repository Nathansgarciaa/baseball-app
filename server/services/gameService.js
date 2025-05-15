const db = require('../db');

exports.addGame = (game_date, home_team_id, away_team_id, location, cb) => {
  db.query('INSERT INTO game (game_date, home_team_id, away_team_id, location, is_final, score) VALUES (?, ?, ?, ?, 0, NULL)', [game_date, home_team_id, away_team_id, location], cb);
};

exports.getGamesByTeamId = (teamId, cb) => {
  db.query(`
    SELECT 
      g.game_id,
      g.game_date,
      g.location,
      g.score,
      g.home_team_id,
      g.away_team_id,
      home.team_name AS home_team_name,
      away.team_name AS away_team_name
    FROM game g
    JOIN team home ON g.home_team_id = home.team_id
    JOIN team away ON g.away_team_id = away.team_id
    WHERE g.home_team_id = ? OR g.away_team_id = ?
    ORDER BY g.game_date DESC
  `, [teamId, teamId], cb);
};

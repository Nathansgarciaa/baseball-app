// Import the configured database connection
const db = require('../db');

// 📌 Add a new game to the database
// Inputs: game date, home team ID, away team ID, location
// Sets score as NULL and is_final as false (0) by default
exports.addGame = (game_date, home_team_id, away_team_id, location, cb) => {
  db.query(
    'INSERT INTO game (game_date, home_team_id, away_team_id, location, is_final, score) VALUES (?, ?, ?, ?, 0, NULL)',
    [game_date, home_team_id, away_team_id, location],
    cb
  );
};

// 📌 Get all games for a specific team (as home or away)
// Includes subqueries to fetch the team names for each game
exports.getGamesByTeamId = (teamId, cb) => {
  db.query(`
    SELECT 
      g.game_id,
      g.game_date,
      g.location,
      g.score,
      g.home_team_id,
      g.away_team_id,
      (SELECT team_name FROM team WHERE team_id = g.home_team_id) AS home_team_name,
      (SELECT team_name FROM team WHERE team_id = g.away_team_id) AS away_team_name
    FROM game g
    WHERE g.home_team_id = ? OR g.away_team_id = ?
    ORDER BY g.game_date DESC
  `, [teamId, teamId], cb);
};

// 📌 Fetch all players involved in a specific game
// Players are joined via their team's participation in the game
exports.fetchPlayersForGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.player_id, p.first_name, p.last_name, p.position, p.team_id
      FROM player p
      JOIN team t ON p.team_id = t.team_id
      JOIN game g ON g.home_team_id = t.team_id OR g.away_team_id = t.team_id
      WHERE g.game_id = ?
    `;

    db.query(query, [gameId], (err, results) => {
      if (err) {
        console.error('❌ DB error in service:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// 📌 Increment a specific stat (like 'hits' or 'walks') for a player in a game
// Uses ON DUPLICATE KEY to insert if not present, otherwise increments
exports.incrementPlayerStat = (game_id, player_id, stat_type) => {
  return new Promise((resolve, reject) => {
    const validStats = [
      'at_bats', 'hits', 'home_runs', 'rbis',
      'strikeouts', 'walks', 'innings_pitched',
      'runs', 'pitches_thrown'
    ];

    // Ensure the stat type is allowed
    if (!validStats.includes(stat_type)) {
      return reject(new Error('Invalid stat type'));
    }

    const query = `
      INSERT INTO player_stats (game_id, player_id, ${stat_type})
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE ${stat_type} = ${stat_type} + 1
    `;

    db.query(query, [game_id, player_id], (err, result) => {
      if (err) {
        console.error('❌ DB error:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// 📌 Fetch all player stats for a given game
// Joins player info with their stats
exports.fetchStatsByGameId = (gameId, cb) => {
  const query = `
    SELECT
      p.first_name,
      p.last_name,
      ps.*
    FROM player_stats ps
    JOIN player p ON ps.player_id = p.player_id
    WHERE ps.game_id = ?
  `;

  db.query(query, [gameId], cb);
};

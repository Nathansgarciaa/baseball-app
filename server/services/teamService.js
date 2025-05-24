// Import the configured database connection
const db = require('../db');

// 📌 Add a new team (used when a coach creates a team)
// coach_user_id is required (not null)
exports.addTeam = (team_name, city_name, state, coach_user_id, cb) => {
  // ⚠️ WARNING: START TRANSACTION/COMMIT shouldn't be used in a single db.query.
  // Use db.beginTransaction if you want real transactions.
  const query = `
    INSERT INTO team (team_name, city_name, state, coach_user_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [team_name, city_name, state, coach_user_id], cb);
};

// 📌 Get all teams (used for admin or debug purposes)
exports.getAllTeams = (cb) => {
  db.query('SELECT * FROM team', cb);
};

// 📌 Check if a team already exists by name, city, and state
// Used to avoid duplicate opponent entries
exports.findTeam = (team_name, city_name, state, cb) => {
  db.query(
    'SELECT team_id FROM team WHERE team_name = ? AND city_name = ? AND state = ? LIMIT 1',
    [team_name, city_name, state],
    cb
  );
};

// 📌 Add a team as an opponent (no coach_user_id, so set to NULL)
exports.addOpponentTeam = (team_name, city_name, state, cb) => {
  const query = `
    INSERT INTO team (team_name, city_name, state, coach_user_id)
    VALUES (?, ?, ?, NULL)
  `;
  db.query(query, [team_name, city_name, state], cb);
};

// 📌 Create a view (or replace it) to fetch all players on a team with their stats
// Summarizes player_stats across all games
exports.fetchPlayersWithStats = (teamId) => {
  return new Promise((resolve, reject) => {
    const viewQuery = `
      CREATE OR REPLACE VIEW PlayerStatsView AS
      SELECT
        p.player_id,
        p.team_id,
        p.first_name,
        p.last_name,
        p.position,
        p.age,
        COALESCE(SUM(ps.at_bats), 0) AS at_bats,
        COALESCE(SUM(ps.hits), 0) AS hits,
        COALESCE(SUM(ps.home_runs), 0) AS home_runs,
        COALESCE(SUM(ps.rbis), 0) AS rbis,
        COALESCE(SUM(ps.strikeouts), 0) AS strikeouts,
        COALESCE(SUM(ps.walks), 0) AS walks,
        COALESCE(SUM(ps.innings_pitched), 0) AS innings_pitched,
        COALESCE(SUM(ps.runs), 0) AS runs,
        COALESCE(SUM(ps.pitches_thrown), 0) AS pitches_thrown
      FROM player p
      LEFT JOIN player_stats ps ON p.player_id = ps.player_id
      WHERE p.is_active = 1
      GROUP BY p.player_id, p.team_id, p.first_name, p.last_name, p.position, p.age
    `;

    // First create or replace the view
    db.query(viewQuery, (err) => {
      if (err) return reject(err);

      // Then query the view to get summarized stats
      const fetchQuery = `SELECT * FROM PlayerStatsView WHERE team_id = ?`;
      db.query(fetchQuery, [teamId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  });
};

// 📌 Get all teams created by a specific coach (by user ID)
exports.getTeamsByCoach = (coachUserId, cb) => {
  const query = `SELECT * FROM team WHERE coach_user_id = ?`;
  db.query(query, [coachUserId], cb);
};

const db = require('../db');

exports.addTeam = (team_name, city_name, state, coach_user_id, cb) => {
  const query = `
    START TRANSACTION;
    INSERT INTO team (team_name, city_name, state, coach_user_id)
    VALUES (?, ?, ?, ?);
    COMMIT;
  `;
  db.query(query, [team_name, city_name, state, coach_user_id], cb);
};

exports.getAllTeams = (cb) => {
  db.query('SELECT * FROM team', cb);
};

exports.findTeam = (team_name, city_name, state, cb) => {
  db.query('SELECT team_id FROM team WHERE team_name = ? AND city_name = ? AND state = ? LIMIT 1', [team_name, city_name, state], cb);
};

exports.addOpponentTeam = (team_name, city_name, state, cb) => {
  const query = `
    START TRANSACTION;
    INSERT INTO team (team_name, city_name, state, coach_user_id)
    VALUES (?, ?, ?, NULL);
    COMMIT;
  `;
  db.query(query, [team_name, city_name, state], cb);
};

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
    db.query(viewQuery, () => {
      const fetchQuery = `SELECT * FROM PlayerStatsView WHERE team_id = ?`;
      db.query(fetchQuery, [teamId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  });
};

exports.getTeamsByCoach = (coachUserId, cb) => {
  const query = `SELECT * FROM team WHERE coach_user_id = ?`;
  db.query(query, [coachUserId], cb);
};

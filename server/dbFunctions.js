// dbFunctions.js
const db = require('./db');

function addTeam(team_name, city_name, state, coach_user_id, callback) {
  const sql = 'INSERT INTO team (team_name, city_name, state, coach_user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [team_name, city_name, state, coach_user_id], callback);
}


function findTeam(team_name, city_name, state, callback) {
  const sql = 'SELECT team_id FROM team WHERE team_name = ? AND city_name = ? AND state = ? LIMIT 1';
  db.query(sql, [team_name, city_name, state], callback);
}

function addGame(game_date, home_team_id, away_team_id, location, callback) {
  const sql = 'INSERT INTO game (game_date, home_team_id, away_team_id, location, is_final, score) VALUES (?, ?, ?, ?, 0, NULL)';
  db.query(sql, [game_date, home_team_id, away_team_id, location], callback);
}

function createUser(username, hash, callback) {
  const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';
  db.query(sql, [username, hash], callback);
}

function findUserByUsername(username, callback) {
  const sql = 'SELECT * FROM user WHERE username = ?';
  db.query(sql, [username], callback);
}

function getAllTeams(callback) {
  const sql = 'SELECT * FROM team';
  db.query(sql, callback);
}
function addOpponentTeam(team_name, city_name, state, callback) {
  const sql = 'INSERT INTO team (team_name, city_name, state, coach_user_id) VALUES (?, ?, ?, NULL)';
  db.query(sql, [team_name, city_name, state], callback);
}

function getGamesByTeamId(teamId, callback) {
  const sql = `
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
  `;
  db.query(sql, [teamId, teamId], callback);
}
const addPlayerToTeam = (teamId, firstName, lastName, position, age, cb) => {
  db.query(
    'INSERT INTO player (first_name, last_name, position, age, is_active, team_id) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, position, age, 1, teamId],
    cb
  );
};

const getPlayersByTeamId = (teamId, cb) => {
  db.query('SELECT * FROM player WHERE team_id = ?', [teamId], cb);
};



module.exports = {
  addTeam,
  findTeam,
  addGame,
  createUser,
  findUserByUsername,
  getAllTeams,
  addOpponentTeam,
  getGamesByTeamId,
  addPlayerToTeam,
  getPlayersByTeamId
};

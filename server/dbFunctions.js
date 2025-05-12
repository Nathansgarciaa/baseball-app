// dbFunctions.js
const db = require('./db');

function addTeam(team_name, city_name, state, callback) {
  const sql = 'INSERT INTO team (team_name, city_name, state) VALUES (?, ?, ?)';
  db.query(sql, [team_name, city_name, state], callback);
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

module.exports = {
  addTeam,
  findTeam,
  addGame,
  createUser,
  findUserByUsername,
  getAllTeams
};

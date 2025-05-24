// Import the configured database connection
const db = require('../db');

// 📌 Function: Add a new player to a team
// Inputs: team ID, player first name, last name, position, and age
// Adds the player as "active" (is_active = 1)
exports.addPlayerToTeam = (teamId, firstName, lastName, position, age, cb) => {
  // ✅ NOTE: START TRANSACTION and COMMIT do not work in this context
  // when used as a single query string with the default MySQL driver.
  // So just use a regular INSERT here unless you explicitly manage transactions.
  const query = `
    INSERT INTO player (first_name, last_name, position, age, is_active, team_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [firstName, lastName, position, age, 1, teamId], cb);
};

// 📌 Function: Get all players on a specific team
exports.getPlayersByTeamId = (teamId, cb) => {
  db.query('SELECT * FROM player WHERE team_id = ?', [teamId], cb);
};

// playerService.js
const db = require('../db');

exports.addPlayerToTeam = (teamId, firstName, lastName, position, age, cb) => {
  const query = `
    START TRANSACTION;
    INSERT INTO player (first_name, last_name, position, age, is_active, team_id)
    VALUES (?, ?, ?, ?, ?, ?);
    COMMIT;
  `;
  db.query(query, [firstName, lastName, position, age, 1, teamId], cb);
};

exports.getPlayersByTeamId = (teamId, cb) => {
  db.query('SELECT * FROM player WHERE team_id = ?', [teamId], cb);
};

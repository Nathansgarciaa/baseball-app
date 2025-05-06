const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET all teams
app.get('/teams', (req, res) => {
  db.query('SELECT * FROM team', (err, results) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// POST a new team
app.post('/teams', (req, res) => {
  const { team_name, city_name, state } = req.body;
  const sql = 'INSERT INTO team (team_name, city_name, state) VALUES (?, ?, ?)';
  db.query(sql, [team_name, city_name, state], (err, result) => {
    if (err) {
      console.error('Error inserting team:', err);
      return res.status(500).json({ error: 'Insert failed' });
    }
    res.status(201).json({ message: 'Team created', team_id: result.insertId });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

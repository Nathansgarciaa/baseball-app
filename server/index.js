const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const {
  addTeam,
  findTeam,
  addGame,
  createUser,
  findUserByUsername,
  getAllTeams
} = require('./dbFunctions');

const app = express();
app.use(cors());
app.use(express.json());

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    createUser(username, hash, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User created' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Password encryption failed' });
  }
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  findUserByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Login successful', user: username });
  });
});

// Get all teams
app.get('/teams', (req, res) => {
  getAllTeams((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a new team
app.post('/teams', (req, res) => {
  const { team_name, city_name, state } = req.body;
  addTeam(team_name, city_name, state, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.status(201).json({ message: 'Team created', team_id: result.insertId });
  });
});

// Add a game
app.post('/teams/:id/games', (req, res) => {
  const userTeamId = parseInt(req.params.id);
  const {
    game_date,
    location,
    opponent_name,
    opponent_city,
    opponent_state,
    role // 1 = home, 2 = away
  } = req.body;

  if (![1, 2].includes(role)) {
    return res.status(400).json({ error: 'Invalid team role (1 = home, 2 = away)' });
  }

  findTeam(opponent_name, opponent_city, opponent_state, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to check opponent' });

    const proceed = (opponentId) => {
      const home_team_id = role === 1 ? userTeamId : opponentId;
      const away_team_id = role === 2 ? userTeamId : opponentId;

      addGame(game_date, home_team_id, away_team_id, location, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert game' });
        res.status(201).json({ message: 'Game created', game_id: result.insertId });
      });
    };

    if (rows.length > 0) {
      proceed(rows[0].team_id);
    } else {
      addTeam(opponent_name, opponent_city, opponent_state, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert opponent team' });
        proceed(result.insertId);
      });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

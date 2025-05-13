const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const {
  createUser,
  findUserByUsername,
  getAllTeams,
  addTeam,
  findTeam,
  addOpponentTeam,
  addGame,
  getGamesByTeamId,
  addPlayerToTeam,
  getPlayersByTeamId
} = require('./dbFunctions');

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    createUser(username, hash, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User created' });
    });
  } catch {
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

// --- TEAM ROUTES ---

// Get all teams
app.get('/teams', (req, res) => {
  getAllTeams((err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Create new team
app.post('/teams', (req, res) => {
  const { team_name, city_name, state, coach_user_id } = req.body;
  if (!coach_user_id) return res.status(400).json({ error: 'Missing coach_user_id' });

  addTeam(team_name, city_name, state, coach_user_id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.status(201).json({ message: 'Team created', team_id: result.insertId });
  });
});

// --- GAME ROUTES ---

// Add a new game
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
      const away_team_id = role === 1 ? opponentId : userTeamId;

      addGame(game_date, home_team_id, away_team_id, location, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert game' });
        res.status(201).json({ message: 'Game created', game_id: result.insertId });
      });
    };

    if (rows.length > 0) {
      proceed(rows[0].team_id);
    } else {
      addOpponentTeam(opponent_name, opponent_city, opponent_state, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert opponent team' });
        proceed(result.insertId);
      });
    }
  });
});

// Get games by team
app.get('/team/:id/games', (req, res) => {
  const teamId = parseInt(req.params.id);
  getGamesByTeamId(teamId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch games' });
    res.json(results);
  });
});

// --- PLAYER ROUTES ---

// Add player to team
app.post('/teams/:id/players', (req, res) => {
  const team_id = parseInt(req.params.id);
  const { first_name, last_name, position, age } = req.body;

  addPlayerToTeam(team_id, first_name, last_name, position, age, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert player failed' });
    res.status(201).json({ message: 'Player added', player_id: result.insertId });
  });
});

// Get players on team
app.get('/teams/:id/players', (req, res) => {
  const team_id = parseInt(req.params.id);
  getPlayersByTeamId(team_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch players failed' });
    res.json(results);
  });
});

// --- START SERVER ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Route mounting
app.use('/auth', authRoutes);         // /auth/login, /auth/signup
app.use('/team', teamRoutes);        // /teams and nested routes
app.use('/games', gameRoutes);        // /games and future game event routes
app.use('/players', playerRoutes);    // /players and stats

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

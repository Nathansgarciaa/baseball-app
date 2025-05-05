const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // parse JSON requests

// TEST: Get all teams
app.get('/teams', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM team');
    res.json(rows);
  } catch (err) {
    console.error('Error querying teams:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// TeamDashboard.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css';

function TeamDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [playerData, setPlayerData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    age: ''
  });
  const [roster, setRoster] = useState([]);

  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/teams/${id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    })
      .then(res => res.json())
      .then(() => {
        alert('✅ Player added!');
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', last_name: '', position: '', age: '' });
      })
      .catch(() => alert('❌ Failed to add player'));
  };

  const fetchRoster = () => {
    fetch(`http://localhost:3001/teams/${id}/players`)
      .then(res => res.json())
      .then(data => {
        setRoster(data);
        setShowRoster(true);
      })
      .catch(() => alert('❌ Failed to load roster'));
  };

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Dashboard</h1>
      <p>Manage games and players here.</p>

      <div className="button-group">
        <button onClick={() => navigate(`/team/${id}/add-game`)}>➕ Add Game</button>
        <button onClick={() => setShowPlayerForm(true)}>👤 Add Player</button>
        <button onClick={() => navigate(`/team/${id}/games`)}>📊 View Games</button>
        <button onClick={fetchRoster}>📋 View Roster</button>
      </div>

      <button onClick={() => navigate('/')}>🔙 Back to Teams</button>

      {showPlayerForm && (
        <div className="modal">
          <form className="modal-content" onSubmit={handlePlayerSubmit}>
            <h2>Add New Player</h2>
            <input
              type="text"
              placeholder="First Name"
              value={playerData.first_name}
              onChange={(e) => setPlayerData({ ...playerData, first_name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={playerData.last_name}
              onChange={(e) => setPlayerData({ ...playerData, last_name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={playerData.position}
              onChange={(e) => setPlayerData({ ...playerData, position: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={playerData.age}
              onChange={(e) => setPlayerData({ ...playerData, age: e.target.value })}
              required
            />
            <button type="submit">✅ Add</button>
            <button type="button" onClick={() => setShowPlayerForm(false)}>❌ Cancel</button>
          </form>
        </div>
      )}

      {showRoster && (
        <div className="modal">
          <div className="modal-content">
            <h2>Team Roster</h2>
            {roster.length === 0 ? (
              <p>No players found.</p>
            ) : (
              <ul>
                {roster.map((player) => (
                  <li key={player.player_id}>
                    {player.first_name} {player.last_name} - {player.position} (Age {player.age})
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowRoster(false)}>❌ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamDashboard;

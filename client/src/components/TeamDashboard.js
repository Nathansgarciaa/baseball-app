import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css';

function TeamDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [playerData, setPlayerData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    age: ''
  });

  const handlePlayerSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/players/team/${id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    })
      .then((res) => res.json())
      .then(() => {
        alert('✅ Player added!');
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', last_name: '', position: '', age: '' });
      })
      .catch((err) => {
        console.error('❌ Failed to add player:', err);
        alert('❌ Failed to add player');
      });
  };

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Dashboard</h1>
      <p>Manage games and players here.</p>

      <div className="button-group">
        <button onClick={() => navigate(`/team/${id}/add-game`)}>➕ Add Game</button>
        <button onClick={() => setShowPlayerForm(true)}>👤 Add Player</button>
        <button onClick={() => navigate(`/team/${id}/games`)}>📊 View Games</button>
        <button onClick={() => navigate(`/team/${id}/roster`)}>📋 View Roster</button>
      </div>

      <button onClick={() => navigate('/home')}>🔙 Back to Teams</button>

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
    </div>
  );
}

export default TeamDashboard;

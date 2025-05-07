// TeamDashboard.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css';

function TeamDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Dashboard</h1>
      <p>Manage games and players here.</p>

      <div className="button-group">
        <button onClick={() => alert(`Add game for team ${id}`)}>➕ Add Game</button>
        <button onClick={() => alert(`Add player for team ${id}`)}>👤 Add Player</button>
        <button onClick={() => alert(`Start live game for team ${id}`)}>⚾ Start Live Game</button>
      </div>

      <button onClick={() => navigate('/')}>🔙 Back to Teams</button>
    </div>
  );
}

export default TeamDashboard;

// src/components/RosterScreen.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css'; // reuse styling

function RosterScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);

  useEffect(() => {


    fetch(`http://localhost:3001/team/${id}/players-with-stats`)
      .then(res => res.json())
      .then(data => setRoster(data))
      .catch(() => alert('❌ Failed to load roster'));
  }, [id]);

  return (
    
    <div className="dashboard-container">
      <h1>Team #{id} Roster & Stats</h1>
      <button onClick={() => navigate(`/team/${id}`)}>🔙 Back to Dashboard</button>

      {roster.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <table className="roster-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Age</th>
              <th>At Bats</th>
              <th>Hits</th>
              <th>HR</th>
              <th>RBIs</th>
              <th>SO</th>
              <th>BB</th>
              <th>IP</th>
              <th>Runs</th>
              <th>Pitches</th>
            </tr>
          </thead>
          <tbody>
        {roster.map((player, i) => (
            <tr
            key={i}
            className="clickable-row"
            onClick={() => alert(`You clicked on ${player.first_name} ${player.last_name}`)}
            >
            <td>{player.first_name} {player.last_name}</td>
            <td>{player.position}</td>
            <td>{player.age}</td>
            <td>{player.at_bats}</td>
            <td>{player.hits}</td>
            <td>{player.home_runs}</td>
            <td>{player.rbis}</td>
            <td>{player.strikeouts}</td>
            <td>{player.walks}</td>
            <td>{player.innings_pitched}</td>
            <td>{player.runs}</td>
            <td>{player.pitches_thrown}</td>
            </tr>
        ))}
        </tbody>

        </table>
      )}
    </div>
  );
}

export default RosterScreen;
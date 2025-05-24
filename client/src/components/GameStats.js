import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css'; // reuse existing styles

function GameStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}/stats`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Fetched stats:", data);  // Debug line
        setStats(data);
      })
      .catch((err) => {
        console.error('❌ Failed to load stats:', err);
        alert('❌ Failed to load stats');
      });
  }, [id]);

  if (stats === null) return <p>Loading stats...</p>;
  if (stats.length === 0) return <p>No stats found for this game.</p>;

  return (
    <div className="dashboard-container">
      <h2>📊 Game #{id} Stats</h2>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>🔙 Back</button>

      <div style={{ overflowX: 'auto' }}>
        <table className="roster-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>AB</th>
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
            {stats.map((s, i) => (
              <tr key={i}>
                <td>{s.first_name} {s.last_name}</td>
                <td>{s.at_bats}</td>
                <td>{s.hits}</td>
                <td>{s.home_runs}</td>
                <td>{s.rbis}</td>
                <td>{s.strikeouts}</td>
                <td>{s.walks}</td>
                <td>{s.innings_pitched}</td>
                <td>{s.runs}</td>
                <td>{s.pitches_thrown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameStats;

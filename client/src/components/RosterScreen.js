import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css'; // reuse styling

function RosterScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);

  //filters
  const [nameFilter, setNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/team/${id}/players-with-stats`)
      .then(res => res.json())
      .then(data => setRoster(data))
      .catch(() => alert('❌ Failed to load roster'));
  }, [id]);

  const filteredRoster = roster.filter((player) => {
    const fullName = `${player.first_name} ${player.last_name}`.toLowerCase();
    const nameMatch = fullName.includes(nameFilter.toLowerCase());
    const positionMatch = positionFilter === '' || player.position.toLowerCase() === positionFilter.toLowerCase();

    return nameMatch && positionMatch;
  });

  return (
   
    <div className="dashboard-container">
      <h1>Team #{id} Roster & Stats</h1>
      <button onClick={() => navigate(`/team/${id}`)}>🔙 Back to Dashboard</button>

      <div className="filter-controls" style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search by name..."
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '8px', width: '200px' }}
      />
      <select
        value={positionFilter}
        onChange={(e) => setPositionFilter(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '8px' }}
      >
        <option value="">All Positions</option>
        <option value="P">P</option>
        <option value="C">C</option>
        <option value="1B">1B</option>
        <option value="2B">2B</option>
        <option value="SS">SS</option>
        <option value="3B">3B</option>
        <option value="LF">LF</option>
        <option value="CF">CF</option>
        <option value="RF">RF</option>
        <option value="DH">DH</option>
        <option value="RP">RP</option>
      </select>
      <button
        onClick={() => {
          setNameFilter('');
          setPositionFilter('');
        }}
        style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#eee', border: '1px solid #ccc' }}
      >
        🔄 Reset Filters
      </button>

    </div>


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
        {filteredRoster.map((player, i) => (
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

// Import React hooks and necessary tools
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For getting team ID from URL and navigating pages
import './TeamDashboard.css'; // Reuse team dashboard styling

// Component to display a team's full player roster and stats
function RosterScreen() {
  const { id } = useParams(); // Get team ID from URL
  const navigate = useNavigate(); // Used to go back to the team dashboard

  const [roster, setRoster] = useState([]); // Store the full list of players
  const [nameFilter, setNameFilter] = useState(''); // Text filter for player names
  const [positionFilter, setPositionFilter] = useState(''); // Dropdown filter for position

  // Fetch player data when the component loads
  useEffect(() => {
    fetch(`http://localhost:3001/team/${id}/players-with-stats`)
      .then(res => res.json())
      .then(data => setRoster(data)) // Store the data in state
      .catch(() => alert('❌ Failed to load roster')); // Show error if fetch fails
  }, [id]);

  // Filter players based on name and position
  const filteredRoster = roster.filter((player) => {
    const fullName = `${player.first_name} ${player.last_name}`.toLowerCase(); // Combine first and last name
    const nameMatch = fullName.includes(nameFilter.toLowerCase()); // Case-insensitive name match
    const positionMatch = positionFilter === '' || player.position.toLowerCase() === positionFilter.toLowerCase();

    return nameMatch && positionMatch;
  });

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Roster & Stats</h1>

      {/* Button to go back to team dashboard */}
      <button onClick={() => navigate(`/team/${id}`)}>🔙 Back to Dashboard</button>

      {/* Filter controls */}
      <div className="filter-controls" style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Name search input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', width: '200px' }}
        />

        {/* Position dropdown */}
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

        {/* Reset filters button */}
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

      {/* Table of players or message if no players found */}
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
                onClick={() => alert(`You clicked on ${player.first_name} ${player.last_name}`)} // Optional interaction
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

// Export so other parts of the app can use it
export default RosterScreen;

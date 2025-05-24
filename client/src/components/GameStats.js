// Import React hooks and dependencies
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Used for reading URL parameters and navigating pages
import Papa from 'papaparse'; // Library for converting JSON data to CSV format
import './TeamDashboard.css'; // Reuse existing CSS styles

// This component displays the game stats for a specific game
function GameStats() {
  const { id } = useParams(); // Extract the game ID from the URL
  const navigate = useNavigate(); // Allows going back or navigating programmatically
  const [stats, setStats] = useState(null); // Holds stats data from the backend

  // Runs once when the component loads
  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}/stats`) // API call to get game stats
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Fetched stats:", data); // Log for debugging
        setStats(data); // Store data in component state
      })
      .catch((err) => {
        console.error('❌ Failed to load stats:', err);
        alert('❌ Failed to load stats');
      });
  }, [id]); // Dependency: re-run if the `id` changes

  // This function converts the stats data to a downloadable CSV
  const handleDownloadCSV = () => {
    if (!stats || stats.length === 0) {
      alert('❌ No data to export.');
      return;
    }

    const csv = Papa.unparse(stats); // Convert JSON to CSV format
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // Create file object
    const url = URL.createObjectURL(blob); // Create downloadable URL
    const link = document.createElement('a'); // Create <a> tag
    link.href = url;
    link.setAttribute('download', `game_${id}_stats.csv`); // Set download filename
    document.body.appendChild(link); // Add <a> to DOM
    link.click(); // Simulate click to download
    document.body.removeChild(link); // Clean up DOM
  };

  // Show loading message while data is being fetched
  if (stats === null) return <p>Loading stats...</p>;

  // Show message if there are no stats
  if (stats.length === 0) return <p>No stats found for this game.</p>;

  // If stats exist, show table
  return (
    <div className="dashboard-container">
      <h2>📊 Game #{id} Stats</h2>

      {/* Navigation buttons */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        🔙 Back
      </button>
      <button
        onClick={handleDownloadCSV}
        style={{ marginBottom: '1rem', marginLeft: '1rem' }}
      >
        ⬇️ Download CSV
      </button>

      {/* Table wrapper to enable horizontal scrolling on small screens */}
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

// Export so other parts of the app can use it
export default GameStats;

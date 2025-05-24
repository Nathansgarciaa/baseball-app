// Import required React and React Router functionality
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For reading the URL and navigating
import './TeamDashboard.css'; // CSS file for styling

// GameCast component: Used to track a live baseball game and update stats in real-time
function GameCast() {
  const { id } = useParams(); // Grab the game ID from the URL
  const navigate = useNavigate(); // Helps redirect to other pages

  // State variables to manage what shows on screen and what is selected
  const [showTracker, setShowTracker] = useState(false); // Toggle the tracker modal
  const [selectedStat, setSelectedStat] = useState(null); // Current stat selected
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Current player selected
  const [players, setPlayers] = useState([]); // List of all players for this game
  const [log, setLog] = useState([]); // Keeps a log of actions taken
  const [inning, setInning] = useState(1); // Current inning
  const [half, setHalf] = useState('top'); // 'top' or 'bottom' of the inning

  // Fetch the list of players for the game when the component first loads
  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}/players`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw players:", data); // Debugging log
        setPlayers(data);
        if (data.length === 0) alert("⚠️ No players found for this game.");
      })
      .catch((err) => console.error('❌ Failed to load players:', err));
  }, [id]);

  // List of stat types that can be added to players
  const statOptions = [
    'at_bats', 'hits', 'home_runs', 'rbis',
    'strikeouts', 'walks', 'innings_pitched',
    'runs', 'pitches_thrown'
  ];

  // When "Add Stat to DB" button is clicked
  const handleAddStat = () => {
    if (!selectedStat || !selectedPlayer) {
      alert("Please select a stat and a player.");
      return;
    }

    // Log entry (what stat was added to what player at what inning)
    const entry = `${selectedPlayer.first_name} ${selectedPlayer.last_name} ➕ ${selectedStat.replace(/_/g, ' ')} (Inning ${inning} ${half})`;
    setLog([entry, ...log]); // Add new entry to the top of the log
    setSelectedStat(null);
    setSelectedPlayer(null);

    // Send stat update to backend API
    fetch(`http://localhost:3001/games/${id}/stat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_id: parseInt(id),
        player_id: selectedPlayer.player_id,
        stat_type: selectedStat
      })
    })
      .then(res => res.json())
      .then(() => console.log('✅ Stat updated')) // Debug log
      .catch(err => console.error('❌ Failed to update stat:', err));
  };

  return (
    <div className="dashboard-container">
      <h2>⚾ Live GameCast – Game #{id}</h2>

      {/* Buttons to launch tracker or view game stats */}
      <div className="button-group" style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowTracker(true)}>📡 Start Live Tracking</button>
        <button
          onClick={() => navigate(`/game/${id}/stats`)} // Navigate to stats page
          style={{
            marginLeft: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📊 Game Stats
        </button>
      </div>

      {/* Tracker modal shows when user clicks "Start Live Tracking" */}
      {showTracker && (
        <div className="modal">
          <div className="modal-content">
            <h3>1️⃣ Select Stat</h3>
            <div className="button-group">
              {/* Render a button for each stat */}
              {statOptions.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setSelectedStat(stat)}
                  className={selectedStat === stat ? 'selected' : ''}
                >
                  +1 {stat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <h3>2️⃣ Select Inning & Half</h3>
            <div className="button-group">
              {/* Dropdown for selecting inning number */}
              <select value={inning} onChange={(e) => setInning(parseInt(e.target.value))}>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>

              {/* Dropdown for top/bottom of inning */}
              <select value={half} onChange={(e) => setHalf(e.target.value)}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <h3>3️⃣ Select Player</h3>
            <div className="button-group scrollable-group">
              {/* Show a message if no players are available */}
              {players.length === 0 ? (
                <p>No players available</p>
              ) : (
                // Render a button for each player
                players.map((p) => (
                  <button
                    key={`player-${p.player_id}`}
                    onClick={() => setSelectedPlayer(p)}
                    className={selectedPlayer?.player_id === p.player_id ? 'selected' : ''}
                  >
                    #{p.player_id} {p.first_name} {p.last_name}
                  </button>
                ))
              )}
            </div>

            {/* Show "Add Stat" button if a stat and player are selected */}
            {selectedStat && selectedPlayer && (
              <button
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '0.6rem 1.2rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleAddStat}
              >
                ✅ Add Stat to DB
              </button>
            )}

            {/* Debug info: List of raw players */}
            <h3>🧪 Debug: Raw Player List</h3>
            <ul style={{
              textAlign: 'left',
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '8px'
            }}>
              {players.map((p) => (
                <li key={p.player_id}>
                  #{p.player_id} {p.first_name} {p.last_name} — {p.position ?? 'N/A'}
                </li>
              ))}
            </ul>

            {/* Show current selected values */}
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p><strong>Selected Stat:</strong> {selectedStat || 'None'}</p>
              <p><strong>Selected Player:</strong> {selectedPlayer ? `${selectedPlayer.first_name} ${selectedPlayer.last_name}` : 'None'}</p>
            </div>

            {/* Event log */}
            <h3>📜 Event Log</h3>
            <ul style={{ textAlign: 'left' }}>
              {log.map((entry, idx) => <li key={idx}>{entry}</li>)}
            </ul>

            {/* Close button */}
            <button onClick={() => setShowTracker(false)} style={{ marginTop: '1rem' }}>❌ Close Tracker</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export this component so it can be used in other parts of the app
export default GameCast;

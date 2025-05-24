import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import './TeamDashboard.css'; // Reuse styling

function GameCast() {
  const { id } = useParams(); // game ID
  const navigate = useNavigate();
  const [showTracker, setShowTracker] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [log, setLog] = useState([]);
  const [inning, setInning] = useState(1);
  const [half, setHalf] = useState('top');

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}/players`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw players:", data);
        setPlayers(data);
        if (data.length === 0) alert("⚠️ No players found for this game.");
      })
      .catch((err) => console.error('❌ Failed to load players:', err));
  }, [id]);

  const statOptions = [
    'at_bats', 'hits', 'home_runs', 'rbis',
    'strikeouts', 'walks', 'innings_pitched',
    'runs', 'pitches_thrown'
  ];

  const handleAddStat = () => {
    if (!selectedStat || !selectedPlayer) {
      alert("Please select a stat and a player.");
      return;
    }

    const entry = `${selectedPlayer.first_name} ${selectedPlayer.last_name} ➕ ${selectedStat.replace(/_/g, ' ')} (Inning ${inning} ${half})`;
    setLog([entry, ...log]);
    setSelectedStat(null);
    setSelectedPlayer(null);

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
      .then(() => console.log('✅ Stat updated'))
      .catch(err => console.error('❌ Failed to update stat:', err));
  };

  return (
    <div className="dashboard-container">
      <h2>⚾ Live GameCast – Game #{id}</h2>

      <div className="button-group" style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowTracker(true)}>📡 Start Live Tracking</button>
        <button
          onClick={() => navigate(`/game/${id}/stats`)}
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

      {showTracker && (
        <div className="modal">
          <div className="modal-content">

            <h3>1️⃣ Select Stat</h3>
            <div className="button-group">
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
              <select value={inning} onChange={(e) => setInning(parseInt(e.target.value))}>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <select value={half} onChange={(e) => setHalf(e.target.value)}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <h3>3️⃣ Select Player</h3>
            <div className="button-group scrollable-group">
              {players.length === 0 ? (
                <p>No players available</p>
              ) : (
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

            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p><strong>Selected Stat:</strong> {selectedStat || 'None'}</p>
              <p><strong>Selected Player:</strong> {selectedPlayer ? `${selectedPlayer.first_name} ${selectedPlayer.last_name}` : 'None'}</p>
            </div>

            <h3>📜 Event Log</h3>
            <ul style={{ textAlign: 'left' }}>
              {log.map((entry, idx) => <li key={idx}>{entry}</li>)}
            </ul>

            <button onClick={() => setShowTracker(false)} style={{ marginTop: '1rem' }}>❌ Close Tracker</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCast;

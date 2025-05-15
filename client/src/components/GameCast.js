import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TeamDashboard.css'; // Reuse shared styles

function GameCast() {
  const { id } = useParams(); // game ID
  const [showTracker, setShowTracker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [log, setLog] = useState([]);
  const [selectedPitcher, setSelectedPitcher] = useState(null);
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

  const handlePlayerClick = (player) => {
    if (!selectedEvent) return alert('❗ Select an event first!');
    if (!selectedPitcher) return alert('❗ Select a pitcher first!');

    const entry = `${player.first_name} ${player.last_name} → ${selectedEvent} (Pitcher: ${selectedPitcher.first_name} ${selectedPitcher.last_name}, Inning: ${inning} ${half})`;
    setLog([entry, ...log]);
    setSelectedEvent(null);

    fetch(`http://localhost:3001/games/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_id: parseInt(id),
        inning,
        half,
        batter_id: player.player_id,
        pitcher_id: selectedPitcher.player_id,
        event_type: selectedEvent
      })
    })
      .then((res) => res.json())
      .then(() => console.log('✅ Event logged'))
      .catch((err) => console.error('❌ Failed to log event:', err));
  };

  const events = [
    'Single', 'Double', 'Triple', 'Home Run',
    'Walk', 'Strikeout', 'Out', 'Steal',
    'Ball', 'Strike (Looking)', 'Strike (Swinging)', 'Foul'
  ];

  // TEMP: Show all players until position data is fixed
  const pitchers = players;
  const batters = players;

  return (
    <div className="dashboard-container">
      <h2>⚾ Live GameCast – Game #{id}</h2>
      <button onClick={() => setShowTracker(true)}>📡 Start Live Tracking</button>

      {showTracker && (
        <div className="modal">
          <div className="modal-content">

            <h3>1️⃣ Select Event</h3>
            <div className="button-group">
              {events.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEvent(e)}
                  className={selectedEvent === e ? 'selected' : ''}
                >
                  {e}
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

            <h3>3️⃣ Select Pitcher</h3>
            <div className="button-group scrollable-group">
              {pitchers.map((p) => (
                <button
                  key={`pitcher-${p.player_id}`}
                  onClick={() => setSelectedPitcher(p)}
                  className={selectedPitcher?.player_id === p.player_id ? 'selected' : ''}
                >
                  #{p.player_id} {p.first_name} {p.last_name}
                </button>
              ))}
            </div>

            <h3>4️⃣ Select Batter</h3>
            <div className="button-group scrollable-group">
              {batters.map((p) => (
                <button
                  key={`batter-${p.player_id}`}
                  onClick={() => handlePlayerClick(p)}
                >
                  #{p.player_id} {p.first_name} {p.last_name}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p><strong>Selected Event:</strong> {selectedEvent || 'None'}</p>
              <p><strong>Selected Pitcher:</strong> {selectedPitcher ? `${selectedPitcher.first_name} ${selectedPitcher.last_name}` : 'None'}</p>
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

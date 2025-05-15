import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TeamDashboard.css';

function GameCast() {
  const { id } = useParams(); // game ID
  const [showTracker, setShowTracker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    // Fixed endpoint
    fetch(`http://localhost:3001/games/${id}/players`)
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Failed to load players:', err));
  }, [id]);

  const handlePlayerClick = (player) => {
    if (!selectedEvent) return alert('Select an event first!');
    const entry = `${player.first_name} ${player.last_name} → ${selectedEvent}`;
    setLog([entry, ...log]);
    setSelectedEvent(null);
  };

  const events = ['Single', 'Double', 'Triple', 'Home Run', 'Walk', 'Strikeout', 'Out', 'Steal'];

  return (
    <div className="dashboard-container">
      <h2>Live GameCast – Game #{id}</h2>
      <button onClick={() => setShowTracker(true)}>📡 Start Live Tracking</button>

      {showTracker && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Event</h3>
            <div className="button-group">
              {events.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEvent(e)}
                  style={{ backgroundColor: selectedEvent === e ? '#90ee90' : '' }}
                >
                  {e}
                </button>
              ))}
            </div>

            <h3>Choose Player</h3>
            <div className="button-group" style={{ flexWrap: 'wrap' }}>
              {players.map((p) => (
                <button
                  key={p.player_id}
                  onClick={() => handlePlayerClick(p)}
                >
                  #{p.player_id} {p.first_name} {p.last_name}
                </button>
              ))}
            </div>

            <h3>Event Log</h3>
            <ul>
              {log.map((entry, idx) => <li key={idx}>{entry}</li>)}
            </ul>

            <button onClick={() => setShowTracker(false)}>❌ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCast;

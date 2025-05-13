// ViewGames.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDashboard.css';

function ViewGames() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/team/${id}/games`)
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Failed to fetch games:', err));
  }, [id]);

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Games</h1>
      <div className="button-group">
        <button onClick={() => navigate(`/team/${id}`)}>🔙 Back to Dashboard</button>
      </div>

      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="games-list">
          {games.map((game) => (
            <div
              key={game.game_id}
              className="team-card"
              onClick={() => navigate(`/game/${game.game_id}`)}
              style={{
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#333',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                marginBottom: '1rem',
                maxWidth: '500px',
                margin: '1rem auto'
              }}
            >
              <h3>{new Date(game.game_date).toLocaleDateString()} @ {game.location}</h3>
              <p><strong>Home:</strong> {game.home_team_name} vs <strong>Away:</strong> {game.away_team_name}</p>
              <p>{game.score ? `Final Score: ${game.score}` : 'Not finalized'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewGames;
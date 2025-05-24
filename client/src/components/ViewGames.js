// Import React hooks and tools
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For accessing route params and navigation
import './TeamDashboard.css'; // Reuse shared styles

// ViewGames: displays all games for a specific team
function ViewGames() {
  const { id } = useParams(); // Get the team ID from the URL
  const navigate = useNavigate(); // Enables navigation to other routes

  const [games, setGames] = useState([]); // Holds the list of games for the team

  // Fetch games for this team when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3001/games/team/${id}/games`)
      .then((res) => res.json())
      .then((data) => setGames(data)) // Store games in state
      .catch((err) => {
        console.error('❌ Failed to fetch games:', err);
        alert('❌ Could not load games');
      });
  }, [id]); // Only run again if `id` changes

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Games</h1>

      {/* Button to go back to team dashboard */}
      <div className="button-group">
        <button onClick={() => navigate(`/team/${id}`)}>🔙 Back to Dashboard</button>
      </div>

      {/* If no games are found, display a message */}
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="games-list">
          {/* Render each game as a clickable card */}
          {games.map((game) => (
            <div
              key={game.game_id}
              className="team-card"
              style={{
                backgroundColor: 'white',
                color: '#333',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                margin: '1rem auto',
                maxWidth: '500px',
                cursor: 'pointer' // Make it feel clickable
              }}
              onClick={() => navigate(`/game/${game.game_id}`)} // Navigate to the game's detail page
            >
              <h3>{new Date(game.game_date).toLocaleDateString()} @ {game.location}</h3>
              <p>
                <strong>Home:</strong> {game.home_team_name} vs <strong>Away:</strong> {game.away_team_name}
              </p>
              <p>
                {game.score ? `Final Score: ${game.score}` : 'Not finalized'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export the component so it can be used in the app
export default ViewGames;

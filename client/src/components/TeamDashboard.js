// Import React hooks and tools
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For reading URL params and navigating pages
import './TeamDashboard.css'; // Import shared styles

// Main dashboard page for a specific team
function TeamDashboard() {
  const { id } = useParams(); // Get the team ID from the URL
  const navigate = useNavigate(); // Used to programmatically navigate to other pages

  const [showPlayerForm, setShowPlayerForm] = useState(false); // Controls whether the "Add Player" form is shown

  // State to store values from the new player form
  const [playerData, setPlayerData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    age: ''
  });

  // Handles the form submission for adding a player
  const handlePlayerSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh

    // Send a POST request to the backend API to create a new player
    fetch(`http://localhost:3001/players/team/${id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    })
      .then((res) => res.json())
      .then(() => {
        alert('✅ Player added!');
        // Reset form and hide modal
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', last_name: '', position: '', age: '' });
      })
      .catch((err) => {
        console.error('❌ Failed to add player:', err);
        alert('❌ Failed to add player');
      });
  };

  return (
    <div className="dashboard-container">
      <h1>Team #{id} Dashboard</h1>
      <p>Manage games and players here.</p>

      {/* Dashboard action buttons */}
      <div className="button-group">
        <button onClick={() => navigate(`/team/${id}/add-game`)}>➕ Add Game</button>
        <button onClick={() => setShowPlayerForm(true)}>👤 Add Player</button>
        <button onClick={() => navigate(`/team/${id}/games`)}>📊 View Games</button>
        <button onClick={() => navigate(`/team/${id}/roster`)}>📋 View Roster</button>
      </div>

      {/* Return to main team list */}
      <button onClick={() => navigate('/home')}>🔙 Back to Teams</button>

      {/* Modal for adding a new player */}
      {showPlayerForm && (
        <div className="modal">
          <form className="modal-content" onSubmit={handlePlayerSubmit}>
            <h2>Add New Player</h2>

            {/* Input: First Name */}
            <input
              type="text"
              placeholder="First Name"
              value={playerData.first_name}
              onChange={(e) => setPlayerData({ ...playerData, first_name: e.target.value })}
              required
            />

            {/* Input: Last Name */}
            <input
              type="text"
              placeholder="Last Name"
              value={playerData.last_name}
              onChange={(e) => setPlayerData({ ...playerData, last_name: e.target.value })}
              required
            />

            {/* Input: Position */}
            <input
              type="text"
              placeholder="Position"
              value={playerData.position}
              onChange={(e) => setPlayerData({ ...playerData, position: e.target.value })}
              required
            />

            {/* Input: Age */}
            <input
              type="number"
              placeholder="Age"
              value={playerData.age}
              onChange={(e) => setPlayerData({ ...playerData, age: e.target.value })}
              required
            />

            {/* Form buttons */}
            <button type="submit">✅ Add</button>
            <button type="button" onClick={() => setShowPlayerForm(false)}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Export the component for use in the app
export default TeamDashboard;

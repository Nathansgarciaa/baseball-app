// Import necessary functions and styles from React and React Router
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddGame.css'; // Import styles for this component

// This component allows a user to add a new game for their team
function AddGame() {
  // Get the current team ID from the URL (e.g. /team/5 will give id = 5)
  const { id } = useParams();

  // This allows us to programmatically navigate the user to another page
  const navigate = useNavigate();

  // Step 1: choosing "home" or "away"
  // Step 2: filling in game and opponent details
  const [step, setStep] = useState(1);

  // Role is either '1' (home team) or '2' (away team)
  const [role, setRole] = useState('');

  // This object stores the values entered into the form
  const [formData, setFormData] = useState({
    game_date: '',        // Date of the game
    location: '',         // Location of the game
    opponent_name: '',    // Opponent's team name
    opponent_city: '',    // Opponent's city
    opponent_state: ''    // Opponent's state
  });

  // Function that gets called when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    // Send a POST request to the backend to create the game
    fetch(`http://localhost:3001/games/team/${id}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role }) // Send form data + role
    })
      .then(res => res.json())
      .then((data) => {
        alert('✅ Game created!');
        // After game is created, navigate to that game’s detail page
        navigate(`/game/${data.game_id}`);
      })
      .catch(() => {
        alert('❌ Failed to add game');
      });
  };

  // STEP 1: Let user pick if they're home or away team
  if (step === 1) {
    return (
      <div className="addgame-container">
        <h2>🏟 Are you the home or away team?</h2>
        <div className="button-group">
          {/* When clicked, save the role and go to step 2 */}
          <button onClick={() => { setRole(1); setStep(2); }}>Home</button>
          <button onClick={() => { setRole(2); setStep(2); }}>Away</button>
        </div>
      </div>
    );
  }

  // STEP 2: Show the form to enter game and opponent info
  return (
    <div className="addgame-container">
      <h2>Add Game ({role === 1 ? 'HOME' : 'AWAY'} team)</h2>

      <form onSubmit={handleSubmit} className="addgame-form">
        {/* Date input for the game */}
        <input
          type="date"
          required
          value={formData.game_date}
          onChange={(e) => setFormData({ ...formData, game_date: e.target.value })}
        />

        {/* Location input */}
        <input
          type="text"
          placeholder="Location"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        {/* Opponent details */}
        <h3>Opponent Info</h3>

        <input
          type="text"
          placeholder="Team Name"
          required
          value={formData.opponent_name}
          onChange={(e) => setFormData({ ...formData, opponent_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          required
          value={formData.opponent_city}
          onChange={(e) => setFormData({ ...formData, opponent_city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          required
          value={formData.opponent_state}
          onChange={(e) => setFormData({ ...formData, opponent_state: e.target.value })}
        />

        {/* Submit and cancel buttons */}
        <button type="submit">✅ Save Game</button>
        <button type="button" onClick={() => navigate(`/team/${id}`)}>❌ Cancel</button>
      </form>
    </div>
  );
}

// Export this component so it can be used in other files
export default AddGame;

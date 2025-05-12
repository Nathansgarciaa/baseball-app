import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddGame.css';

function AddGame() {
  const { id } = useParams(); // this is YOUR team ID
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1 = role selection, step 2 = form
  const [role, setRole] = useState(''); // 'home' or 'away'

  const [formData, setFormData] = useState({
    game_date: '',
    location: '',
    opponent_name: '',
    opponent_city: '',
    opponent_state: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/teams/${id}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role })
    })
      .then(res => res.json())
      .then(() => {
        alert('Game created!');
        navigate(`/team/${id}`);
      })
      .catch(() => {
        alert('❌ Failed to add game');
      });
  };

  if (step === 1) {
    return (
      <div className="addgame-container">
        <h2>🏟 Are you the home or away team?</h2>
        <div className="button-group">
          <button onClick={() => { setRole('home'); setStep(2); }}>Home</button>
          <button onClick={() => { setRole('away'); setStep(2); }}>Away</button>
        </div>
      </div>
    );
  }

  return (
    <div className="addgame-container">
      <h2>Add Game ({role.toUpperCase()} team)</h2>
      <form onSubmit={handleSubmit} className="addgame-form">
        <input
          type="date"
          required
          value={formData.game_date}
          onChange={(e) => setFormData({ ...formData, game_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
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
          value={formData.opponent_city}
          onChange={(e) => setFormData({ ...formData, opponent_city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          value={formData.opponent_state}
          onChange={(e) => setFormData({ ...formData, opponent_state: e.target.value })}
        />

        <button type="submit">✅ Save Game</button>
        <button type="button" onClick={() => navigate(`/team/${id}`)}>❌ Cancel</button>
      </form>
    </div>
  );
}

export default AddGame;

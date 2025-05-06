import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ team_name: '', city_name: '', state: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch('http://localhost:3001/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Fetch error:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowForm(false);
        setFormData({ name: '', city: '', state: '' });
        fetchTeams(); // Refresh team list
      })
      .catch(err => console.error('POST error:', err));
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="app-title">⚾ Stat Tracker</h1>
        <p className="subheading">Welcome, Coach. Manage your teams below.</p>
      </header>

      <div className="team-scroll">
        {teams.map((team, index) => (
          <div className="team-card" key={index}>
            <h3>{team.name}</h3>
            <p>{team.city}, {team.state}</p>
          </div>
        ))}
        <div className="team-card create-card" onClick={() => setShowForm(true)}>
          <h3>➕ Create Team</h3>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleSubmit}>
            <h2>Create New Team</h2>
            <input type="text" placeholder="Team Name" value={formData.name} required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="City" value={formData.city} required
              onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <input type="text" placeholder="State" value={formData.state} required
              onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <button type="submit">✅ Create</button>
            <button type="button" onClick={() => setShowForm(false)}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    city_name: '',
    state: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("❌ No user ID found in localStorage");
      return;
    }

    fetch(`http://localhost:3001/team/user/${userId}`)
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Fetch error:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("You're not logged in. Can't create team.");
      return;
    }

    const teamData = {
      ...formData,
      coach_user_id: parseInt(userId)
    };

    fetch('http://localhost:3001/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to create team");
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setFormData({ team_name: '', city_name: '', state: '' });
        fetchTeams(); // refresh list
      })
      .catch(err => {
        console.error('POST error:', err);
        alert('❌ Failed to create team');
      });
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="app-title">⚾ Stat Tracker</h1>
        <p className="subheading">Welcome, Coach. Manage your teams below.</p>
      </header>

      <div className="team-scroll">
        {teams.map((team) => (
          <Link key={team.team_id} to={`/team/${team.team_id}`} className="team-card">
            <h3>{team.team_name}</h3>
            <p>{team.city_name}, {team.state}</p>
          </Link>
        ))}
        <div className="team-card create-card" onClick={() => setShowForm(true)}>
          <h3>➕ Create Team</h3>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleSubmit}>
            <h2>Create New Team</h2>
            <input
              type="text"
              placeholder="Team Name"
              value={formData.team_name}
              required
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city_name}
              required
              onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              required
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <button type="submit">✅ Create</button>
            <button type="button" onClick={() => setShowForm(false)}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;

// Import React hooks and components
import React, { useEffect, useState } from 'react';
import './Home.css'; // Custom styling for this page
import { Link } from 'react-router-dom'; // Used for navigation between pages

// Home component: shows all the teams created by the logged-in user
function Home() {
  const [teams, setTeams] = useState([]); // List of teams for the user
  const [showForm, setShowForm] = useState(false); // Controls whether the "Create Team" modal is visible
  const [formData, setFormData] = useState({
    team_name: '',
    city_name: '',
    state: ''
  }); // Form data for creating a new team

  // This runs once when the component is loaded
  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch teams associated with the current user
  const fetchTeams = () => {
    const userId = localStorage.getItem('userId'); // Get user ID from browser storage
    if (!userId) {
      console.error("❌ No user ID found in localStorage");
      return;
    }

    // Fetch all teams created by this user
    fetch(`http://localhost:3001/team/user/${userId}`)
      .then(res => res.json())
      .then(data => setTeams(data)) // Save to state
      .catch(err => console.error('Fetch error:', err));
  };

  // When the user submits the "Create Team" form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    const userId = localStorage.getItem('userId'); // Again, get the user ID
    if (!userId) {
      alert("You're not logged in. Can't create team.");
      return;
    }

    // Add the coach ID to the form data
    const teamData = {
      ...formData,
      coach_user_id: parseInt(userId)
    };

    // Send a POST request to create the team
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
        // Reset form, hide modal, and reload the team list
        setShowForm(false);
        setFormData({ team_name: '', city_name: '', state: '' });
        fetchTeams();
      })
      .catch(err => {
        console.error('POST error:', err);
        alert('❌ Failed to create team');
      });
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <h1 className="app-title">⚾ Stat Tracker</h1>
        <p className="subheading">Welcome, Coach. Manage your teams below.</p>
      </header>

      {/* Scrollable list of team cards */}
      <div className="team-scroll">
        {teams.map((team) => (
          <Link
            key={team.team_id}
            to={`/team/${team.team_id}`} // Link to that team’s dashboard
            className="team-card"
          >
            <h3>{team.team_name}</h3>
            <p>{team.city_name}, {team.state}</p>
          </Link>
        ))}

        {/* Card to open the create team form */}
        <div className="team-card create-card" onClick={() => setShowForm(true)}>
          <h3>➕ Create Team</h3>
        </div>
      </div>

      {/* Modal form to create a new team */}
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

            {/* Buttons to submit or cancel */}
            <button type="submit">✅ Create</button>
            <button type="button" onClick={() => setShowForm(false)}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Export so the app can use this component
export default Home;

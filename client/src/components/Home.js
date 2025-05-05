import React from 'react';
import './Home.css'; // optional styling file

function Home() {
  return (
    <div className="home-container">
      <h1>⚾ Youth Baseball Stat Tracker</h1>
      <p>Welcome, Coach!</p>

      <div className="button-group">
        <button onClick={() => alert('Add Game')}>➕ Add Game</button>
        <button onClick={() => alert('Enter Stats')}>📝 Enter Stats</button>
        <button onClick={() => alert('View Players')}>👥 View Players</button>
        <button onClick={() => alert('View Stats')}>📊 View Team Stats</button>
      </div>
    </div>
  );
}

export default Home;

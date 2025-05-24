import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import TeamDashboard from './components/TeamDashboard';
import AddGame from './components/AddGame';
import Login from './components/login';
import ViewGames from './components/ViewGames';
import GameCast from './components/GameCast';


import GameStats from './components/GameStats';

import RosterScreen from './components/RosterScreen'; // adjust path if needed



function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team/:id" element={<TeamDashboard />} />
        <Route path="/team/:id/add-game" element={<AddGame />} />
        <Route path="/team/:id/games" element={<ViewGames />} />
        <Route path="/game/:id" element={<GameCast />} />
        <Route path="/team/:id/roster" element={<RosterScreen />} />
        <Route path="/game/:id/stats" element={<GameStats />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

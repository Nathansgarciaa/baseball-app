import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import TeamDashboard from './components/TeamDashboard';
import AddGame from './components/AddGame';
import Login from './components/login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team/:id" element={<TeamDashboard />} />
        <Route path="/team/:id/add-game" element={<AddGame />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

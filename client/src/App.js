// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import TeamDashboard from './components/TeamDashboard';
console.log('🏠 Home:', typeof Home);
console.log('📋 TeamDashboard:', typeof TeamDashboard);


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:id" element={<TeamDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Veicoli from './pages/Veicoli';
import Assegnazioni from './pages/Assegnazioni';
import Autisti from './pages/Autisti';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/veicoli" element={<Veicoli />} />
          <Route path="/assegnazioni" element={<Assegnazioni />} />
          <Route path="/autisti" element={<Autisti />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
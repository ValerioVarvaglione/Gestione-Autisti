// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Veicoli from './pages/Veicoli';
import Assegnazioni from './pages/Assegnazioni';
import Autisti from './pages/Autisti';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Importa la rotta protetta

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Rotte protette */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veicoli"
            element={
              <ProtectedRoute>
                <Veicoli />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assegnazioni"
            element={
              <ProtectedRoute>
                <Assegnazioni />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autisti"
            element={
              <ProtectedRoute>
                <Autisti />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

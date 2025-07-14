// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import SearchDashboard from './components/SearchDashboard';
import Home from './components/Home';
import RealtimeDashboard from './components/RealtimeDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: '200px', padding: '20px', flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<SearchDashboard />} />
                <Route path="/realtime" element={<RealtimeDashboard />} />
              </Routes>
            </div>
          </div>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;

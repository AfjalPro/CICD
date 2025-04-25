import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute token={token}>
            <Dashboard token={token} />
          </ProtectedRoute>
        } />
      </Routes>
    </Container>
  );
}

export default App;
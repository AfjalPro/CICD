import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PostsPage from './components/PostsPage';
import PostForm from './components/PostForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />

        <Route path="/posts" element={
          <ProtectedRoute token={token}>
            <PostsPage token={token} setToken={setToken} />
          </ProtectedRoute>
        } />

        <Route path="/posts/new" element={
          <ProtectedRoute token={token}>
            <PostForm token={token} />
          </ProtectedRoute>
        } />

        <Route path="/posts/:id/edit" element={
          <ProtectedRoute token={token}>
            <PostForm token={token} />
          </ProtectedRoute>
        } />
      </Routes>
    </Container>
  );
}

export default App;
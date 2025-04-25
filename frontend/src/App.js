import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PostsPage from './components/PostsPage';
import PostForm from './components/PostForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/new" element={<PostForm />} />
      <Route path="/posts/:id/edit" element={<PostForm />} />
    </Routes>
  );
}

export default App;
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      nav('/dashboard');
      nav('/posts');
    } catch(err) {
      setError(err.response?.data.detail || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
      <TextField label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
      <Button variant="contained" type="submit">Log In</Button>
      <Link href="/signup" underline="hover">Don't have an account? Sign up</Link>
    </Box>
  );
}
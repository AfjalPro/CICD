import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../features/auth/authService';
import { setCredentials, setError, setLoading } from '../features/auth/authSlice';

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const user = await authApi.signup(data);
      const token = await authApi.login({
        username: data.username,
        password: data.password,
      });
      dispatch(setCredentials({ user, token }));
      navigate('/me/posts');
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Registration failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          {...register('username')}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          {...register('email')}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register('password')}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}
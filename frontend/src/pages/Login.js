import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../features/auth/authService';
import { setCredentials, setError, setLoading } from '../features/auth/authSlice';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      
      // 1. Get the token
      const loginResponse = await authApi.login(data);
      console.log('Token Response:', loginResponse);  // Add this
      
      // 2. Get user details
      const userResponse = await authApi.getMe(loginResponse.access_token);
      console.log('User Response:', userResponse);  // Add this
      
      // 3. Update store
      dispatch(setCredentials({
        user: userResponse,
        token: loginResponse.access_token
      }));
      
      navigate('/me/posts');
    } catch (err) {
      console.error('Full error:', err);  // Add this
      dispatch(setError(err.response?.data?.detail || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          {...register('username', { required: true })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register('password', { required: true })}
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/signup" underline="hover">
            Sign up here
          </Link>
        </Typography>
      </form>
    </Container>
  );
}
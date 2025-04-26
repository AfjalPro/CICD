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
    dispatch(setLoading(true));
    try {
      // 1️⃣ Create the user
      await authApi.signup(data);

      // 2️⃣ Immediately log them in
      const loginResponse = await authApi.login({
        username: data.username,
        password: data.password,
      });

      // 3️⃣ Fetch their profile
      const userResponse = await authApi.getMe(loginResponse.access_token);

      // 4️⃣ Store exactly the string token + user object
      dispatch(setCredentials({
        user:  userResponse,
        token: loginResponse.access_token
      }));

      // 5️⃣ Redirect to their posts
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
          {...register('username', { required: 'Username is required' })}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          {...register('email',    { required: 'Email is required' })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register('password', { required: 'Password is required' })}
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
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

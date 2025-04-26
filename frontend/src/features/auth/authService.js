import api from '../../api/axios';

export const authApi = {
  signup: async (userData) => {
    const response = await api.post('/signup/', {
      username: userData.username,
      email:    userData.email,
      password: userData.password,
    });
    return response.data;
  },

  login: async (credentials) => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await api.post('/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;  // { access_token: "...", token_type: "bearer" }
  },

  getMe: async (token) => {
    const response = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

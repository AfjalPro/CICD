import api from '../../api/axios';

export const authApi = {
    login: async (credentials) => {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await api.post('/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    getMe: async (token) => {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  };
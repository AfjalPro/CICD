import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const signup = (data) => API.post('/signup', data);
export const login = (data) => API.post('/login', new URLSearchParams(data));
export const fetchItems = (token) => API.get('/items/', {
  headers: { Authorization: `Bearer ${token}` }
});
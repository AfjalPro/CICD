import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:8000' });

// Auth
export const signup = (data) => API.post('/signup', data);
export const login  = (data) => API.post('/login', new URLSearchParams(data));

// Posts CRUD
export const fetchPosts   = (author) => API.get('/posts/', { params: author ? { author } : {} });
export const fetchPost    = (id) => API.get(`/posts/${id}`);
export const createPost   = (post, token) => API.post('/posts/', post, { headers: { Authorization: `Bearer ${token}` } });
export const updatePost   = (id, post, token) => API.put(`/posts/${id}`, post, { headers: { Authorization: `Bearer ${token}` } });
export const deletePost   = (id, token) => API.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:8000' });

export const fetchPosts = () => API.get('/posts/');
export const fetchPost  = (id) => API.get(`/posts/${id}`);
export const createPost = (post) => API.post('/posts/', post);
export const updatePost = (id, post) => API.put(`/posts/${id}`, post);
export const deletePost = (id) => API.delete(`/posts/${id}`);
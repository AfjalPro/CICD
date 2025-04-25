import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, deletePost } from '../api';
import BlogPost from '../BlogPost';

export default function PostsPage({ token, setToken }) {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const nav = useNavigate();

  useEffect(() => {
    fetchPosts().then(res => setPosts(res.data));
  }, []);

  const authors = ['All', ...new Set(posts.map(p => p.owner_username))];
  const displayed = posts.filter(p => filter === 'All' || p.owner_username === filter);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    nav('/login');
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      await deletePost(id, token);
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Posts</Typography>
        <Box>
          <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
            <InputLabel>Author</InputLabel>
            <Select
              value={filter}
              label="Author"
              onChange={e => setFilter(e.target.value)}
            >
              {authors.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleLogout}>Log Out</Button>
        </Box>
      </Box>

      <Button variant="contained" onClick={() => nav('/posts/new')}>New Post</Button>

      {displayed.map(post => (
        <Box key={post.id} sx={{ position: 'relative' }}>
          <BlogPost {...post} author={post.owner_username} />
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button size="small" onClick={() => nav(`/posts/${post.id}/edit`)}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(post.id)}>Delete</Button>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
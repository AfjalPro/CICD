import React, { useEffect, useState } from 'react';
import { fetchPosts, deletePost } from '../api';
import { Box, Button, Stack, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  useEffect(() => { load(); }, []);
  const load = async () => {
    const res = await fetchPosts();
    setPosts(res.data);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    load();
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">All Posts</Typography>
        <Button variant="contained" onClick={() => nav('/posts/new')}>New Post</Button>
      </Box>

      {posts.map(p => (
        <Card key={p.id}>
          <CardContent>
            <Typography variant="h6">{p.title}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {new Date(p.created_at).toLocaleString()}
            </Typography>
            <Typography>{p.content}</Typography>
            <Box sx={{ mt: 1 }}>
              <Button size="small" onClick={() => nav(`/posts/${p.id}/edit`)}>Edit</Button>
              <Button size="small" color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
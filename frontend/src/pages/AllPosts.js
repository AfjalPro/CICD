import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Container } from '@mui/material';
import api from '../api/axios';

export default function AllPosts() {
  const [posts, setPosts] = React.useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/');
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [token]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2">{post.content}</Typography>
            <Typography variant="caption">
              Posted on: {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
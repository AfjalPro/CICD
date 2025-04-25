import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Container, Button } from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const [posts, setPosts] = React.useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/me');
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
        My Posts
      </Typography>
      <Button 
        variant="contained" 
        sx={{ mb: 2 }}
        onClick={() => navigate('/posts/new')}
      >
        Create New Post
      </Button>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2">{post.content}</Typography>
            <Typography variant="caption">
                Posted on: {new Date(post.created_at).toLocaleDateString()}
            </Typography>
            <div style={{ marginTop: '1rem' }}>
                <Button 
                size="small" 
                onClick={() => navigate(`/posts/${post.id}/edit`)}
                sx={{ mr: 1 }}
                >
                Edit
                </Button>
                <Button 
                size="small" 
                color="error"
                onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this post?')) {
                    await api.delete(`/posts/${post.id}`);
                    setPosts(posts.filter(p => p.id !== post.id));
                    }
                }}
                >
                Delete
                </Button>
            </div>
            </CardContent>
        </Card>
      ))}
    </Container>
  );
}
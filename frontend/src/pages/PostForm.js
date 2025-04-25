import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function PostForm() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const { id } = useParams();
  const isEdit = !!id;
  const [post, setPost] = React.useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  React.useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
        setValue('title', response.data.title);
        setValue('content', response.data.content);
      };
      fetchPost();
    }
  }, [id, setValue, isEdit]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, data);
      } else {
        await api.post('/posts/', data);
      }
      navigate('/me/posts');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          fullWidth
          label="Content"
          margin="normal"
          multiline
          rows={4}
          {...register('content', { required: 'Content is required' })}
          error={!!errors.content}
          helperText={errors.content?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Post
        </Button>
      </form>
    </Container>
  );
}
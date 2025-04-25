import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createPost, fetchPost, updatePost } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: '', content: '' });
  const nav = useNavigate();

  useEffect(() => {
    if (isEdit) {
      fetchPost(id).then(res => setForm({ title: res.data.title, content: res.data.content }));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) await updatePost(id, form);
    else       await createPost(form);
    nav('/posts');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h5">{isEdit ? 'Edit' : 'New'} Post</Typography>
      <TextField
        label="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />
      <TextField
        label="Content"
        multiline
        rows={4}
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
        required
      />
      <Button variant="contained" type="submit">
        {isEdit ? 'Update' : 'Create'}
      </Button>
    </Box>
  );
}
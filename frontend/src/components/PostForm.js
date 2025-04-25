import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, fetchPost, updatePost } from '../api';

export default function PostForm({ token }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: '', date: '', image: '', content: '' });
  const nav = useNavigate();

  useEffect(() => {
    if (isEdit) {
      fetchPost(id).then(res => {
        const p = res.data;
        setForm({
          title: p.title,
          author: p.author,
          date: p.date.split('T')[0],
          image: p.image || '',
          content: p.content,
        });
      });
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, date: new Date(form.date) };
    if (isEdit) await updatePost(id, payload, token);
    else await createPost(payload, token);
    nav('/posts');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">{isEdit ? 'Edit Post' : 'New Post'}</Typography>
      <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <TextField label="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
      <TextField
        label="Date"
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField label="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
      <TextField
        label="Content"
        multiline
        rows={6}
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
        required
      />
      <Button variant="contained" type="submit">
        {isEdit ? 'Update Post' : 'Create Post'}
      </Button>
    </Box>
  );
}